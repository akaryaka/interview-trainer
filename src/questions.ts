export const questions = [
  {
    id: 1,
    category: "theory",
    difficulty: "easy",
    question: "Что такое Virtual DOM и зачем он нужен в React?",
    hint: "Подумайте о производительности и оптимизации обновлений",
    answer: `Virtual DOM — это легковесная копия реального DOM в памяти. React использует его для оптимизации обновлений:

1. При изменении состояния создается новый Virtual DOM
2. React сравнивает его с предыдущей версией (diffing algorithm)
3. Находятся минимальные изменения
4. Только эти изменения применяются к реальному DOM (reconciliation)

Это позволяет избежать дорогих операций с реальным DOM и значительно ускоряет работу приложения.`,
  },
  {
    id: 2,
    category: "theory",
    difficulty: "medium",
    question: "В чем разница между useEffect и useLayoutEffect?",
    hint: "Когда выполняется каждый из них относительно рендеринга?",
    answer: `useEffect:
- Выполняется АСИНХРОННО после рендеринга
- Не блокирует отрисовку браузера
- Подходит для большинства задач: запросы к API, подписки, логирование

useLayoutEffect:
- Выполняется СИНХРОННО после всех изменений DOM, но ДО отрисовки браузера
- Блокирует визуальное обновление
- Используется для измерений DOM и синхронных обновлений визуала

Пример useLayoutEffect: когда нужно измерить размер элемента и сразу применить стили, чтобы избежать "мигания".`,
  },
  {
    id: 3,
    category: "practice",
    difficulty: "medium",
    question:
      "Реализуйте компонент модального окна с закрытием по Esc и клику вне области",
    hint: "Используйте useEffect для подписки на события и useRef для контейнера",
    answer: `import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
      </div>
    </div>
  );
}`,
  },
  {
    id: 4,
    category: "practice",
    difficulty: "hard",
    question: "Реализуйте кастомный хук useDebounce для дебаунсинга значений",
    hint: "Используйте useState и useEffect с таймером",
    answer: `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления значения
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при изменении value или delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Использование:
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Делаем API запрос только когда пользователь перестал печатать
      fetchResults(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Поиск..."
    />
  );
}`,
  },
  {
    id: 5,
    category: "theory",
    difficulty: "medium",
    question:
      "Когда нужно использовать useMemo и useCallback? Приведите примеры.",
    hint: "Подумайте о производительности и ссылочной идентичности",
    answer: `useMemo - мемоизирует ВЫЧИСЛЕННОЕ ЗНАЧЕНИЕ:
- Дорогие вычисления (фильтрация больших массивов, сложные расчеты)
- Сохранение ссылочной идентичности объектов для зависимостей useEffect

Пример:
const filteredList = useMemo(() => {
  return items.filter(item => item.category === activeCategory);
}, [items, activeCategory]);

useCallback - мемоизирует ФУНКЦИЮ:
- Передача функций в дочерние компоненты, обернутые в React.memo
- Функции в зависимостях useEffect
- Обработчики событий в оптимизированных компонентах

Пример:
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // Функция не пересоздается при каждом рендере

ВАЖНО: Не используйте их везде! Только когда есть реальная проблема производительности.`,
  },
  {
    id: 6,
    category: "practice",
    difficulty: "hard",
    question: "Реализуйте компонент бесконечной прокрутки (infinite scroll)",
    hint: "Используйте Intersection Observer API и useRef",
    answer: `import { useState, useEffect, useRef, useCallback } from 'react';

function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  const lastItemRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading]);

  useEffect(() => {
    setLoading(true);
    
    // Имитация API запроса
    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => 
        \`Item \${(page - 1) * 20 + i + 1}\`
      );
      setItems(prev => [...prev, ...newItems]);
      setLoading(false);
    }, 1000);
  }, [page]);

  return (
    <div style={{ height: '400px', overflow: 'auto' }}>
      {items.map((item, index) => (
        <div
          key={item}
          ref={items.length === index + 1 ? lastItemRef : null}
          style={{ padding: '20px', border: '1px solid #ccc' }}
        >
          {item}
        </div>
      ))}
      {loading && <div>Загрузка...</div>}
    </div>
  );
}`,
  },
  {
    id: 7,
    category: "theory",
    difficulty: "easy",
    question: "Что такое React.memo и когда его использовать?",
    hint: "Подумайте о предотвращении лишних ре-рендеров",
    answer: `React.memo - это HOC (Higher Order Component), который мемоизирует компонент и предотвращает его ре-рендер, если пропсы не изменились.

Как работает:
1. React сравнивает старые и новые пропсы (shallow comparison)
2. Если пропсы не изменились - компонент не ре-рендерится
3. Если изменились - компонент ре-рендерится

Когда использовать:
- Компоненты, которые рендерятся часто с одинаковыми пропсами
- "Тяжелые" компоненты с дорогим рендерингом
- Компоненты в списках

Когда НЕ использовать:
- Простые компоненты (накладные расходы превысят выгоду)
- Компоненты, пропсы которых меняются при каждом рендере
- Без необходимости (профилируйте сначала!)

Пример:
const ExpensiveComponent = React.memo(({ data }) => {
  // Дорогой рендеринг
  return <div>{/* ... */}</div>;
});

Можно передать кастомную функцию сравнения:
React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});`,
  },
];
