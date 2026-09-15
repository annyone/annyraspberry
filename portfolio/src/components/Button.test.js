import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button';

function Star(props) {
  return <svg data-testid="icon" {...props} />;
}

test('без адреса это кнопка, и обязательно type="button"', () => {
  render(<Button>Нажать</Button>);
  const button = screen.getByRole('button', { name: 'Нажать' });

  // Без явного type кнопка внутри формы отправляла бы её.
  expect(button).toHaveAttribute('type', 'button');
});

test('нажатие вызывает обработчик', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick}>Нажать</Button>);

  fireEvent.click(screen.getByRole('button', { name: 'Нажать' }));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('с href это обычная ссылка', () => {
  render(
    <Button href="/CV.pdf" download="CV.pdf">
      Скачать
    </Button>
  );
  const link = screen.getByRole('link', { name: 'Скачать' });

  expect(link).toHaveAttribute('href', '/CV.pdf');
  expect(link).toHaveAttribute('download', 'CV.pdf');
});

// Внутренний переход должен идти через react-router, иначе страница
// перезагружается целиком и теряется состояние приложения.
test('с to это ссылка react-router', () => {
  render(
    <MemoryRouter>
      <Button to="/logiq">Кейс</Button>
    </MemoryRouter>
  );

  expect(screen.getByRole('link', { name: 'Кейс' })).toHaveAttribute('href', '/logiq');
});

describe('значок перед подписью', () => {
  test('необязателен', () => {
    render(<Button>Без значка</Button>);
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  test('стоит перед подписью, а не после', () => {
    render(<Button icon={<Star />}>Скачать</Button>);
    const button = screen.getByRole('button', { name: 'Скачать' });

    expect(button.firstElementChild).toBe(screen.getByTestId('icon'));
  });

  // Значок дублирует подпись рядом, поэтому программе чтения с экрана
  // он не нужен: иначе она озвучит кнопку дважды.
  test('скрыт от программ чтения с экрана', () => {
    render(<Button icon={<Star />}>Скачать</Button>);
    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
  });
});
