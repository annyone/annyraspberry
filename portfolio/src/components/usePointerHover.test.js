import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import usePointerHover from './usePointerHover';

function Showcase() {
  const ref = usePointerHover();
  return (
    <div ref={ref}>
      <a className="project-tile" href="/one">
        First
      </a>
      <a className="project-tile" href="/two">
        Second
      </a>
    </div>
  );
}

let pending;
const originalHitTest = document.elementFromPoint;

beforeEach(() => {
  pending = null;
  document.elementFromPoint = jest.fn();
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    pending = callback;
    return 1;
  });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {
    pending = null;
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  document.elementFromPoint = originalHitTest;
});

function move(pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { bubbles: true, clientX: 120, clientY: 180 });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  fireEvent(document, event);
}

function flushFrame() {
  act(() => {
    const callback = pending;
    pending = null;
    callback?.();
  });
}

test('скролл переключает наведение без движения указателя', () => {
  render(<Showcase />);
  const first = screen.getByText('First');
  const second = screen.getByText('Second');
  document.elementFromPoint.mockReturnValue(first);
  move();
  flushFrame();
  expect(first).toHaveAttribute('data-pointer-hover', 'true');

  document.elementFromPoint.mockReturnValue(second);
  fireEvent.scroll(window);
  fireEvent.scroll(window);
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
  flushFrame();
  expect(document.elementFromPoint).toHaveBeenLastCalledWith(120, 180);
  expect(first).not.toHaveAttribute('data-pointer-hover');
  expect(second).toHaveAttribute('data-pointer-hover', 'true');
});

test('скролл снимает наведение, если под указателем другой контент', () => {
  render(<Showcase />);
  const first = screen.getByText('First');
  document.elementFromPoint.mockReturnValue(first);
  move();
  flushFrame();
  document.elementFromPoint.mockReturnValue(document.body);
  fireEvent.scroll(window);
  flushFrame();
  expect(first).not.toHaveAttribute('data-pointer-hover');
});

test('касание, потеря фокуса и размонтирование отменяют наведение', () => {
  const { unmount } = render(<Showcase />);
  const first = screen.getByText('First');
  document.elementFromPoint.mockReturnValue(first);
  move();
  flushFrame();
  move('touch');
  expect(first).not.toHaveAttribute('data-pointer-hover');
  move();
  fireEvent.blur(window);
  expect(pending).toBeNull();
  move();
  unmount();
  expect(pending).toBeNull();
});

test('скролл обновляет смещение ореола, а уход с карточки сбрасывает его', () => {
  render(<Showcase />);
  const first = screen.getByText('First');
  const bounds = jest.spyOn(first, 'getBoundingClientRect');
  bounds.mockReturnValue({ left: 20, top: 80, width: 200, height: 200 });
  document.elementFromPoint.mockReturnValue(first);
  move();
  flushFrame();
  expect(first.style.getPropertyValue('--pointer-x')).toBe('0px');
  expect(first.style.getPropertyValue('--pointer-y')).toBe('0px');

  bounds.mockReturnValue({ left: 20, top: 30, width: 200, height: 200 });
  fireEvent.scroll(window);
  flushFrame();
  expect(first.style.getPropertyValue('--pointer-y')).toBe('6px');

  fireEvent(document, new MouseEvent('pointerout', { relatedTarget: null }));
  expect(first).not.toHaveAttribute('data-pointer-hover');
  expect(first.style.getPropertyValue('--pointer-x')).toBe('');
  expect(first.style.getPropertyValue('--pointer-y')).toBe('');
});

test('не активирует карточку вне своей секции', () => {
  render(
    <>
      <Showcase />
      <a className="project-tile" href="/outside">
        Outside
      </a>
    </>
  );
  const outside = screen.getByText('Outside');
  document.elementFromPoint.mockReturnValue(outside);
  move();
  flushFrame();
  expect(outside).not.toHaveAttribute('data-pointer-hover');
});
