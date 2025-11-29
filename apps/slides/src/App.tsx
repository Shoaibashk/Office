import { useState, useCallback } from 'react';

type SlideElement = {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
};

type Slide = {
  id: string;
  elements: SlideElement[];
  backgroundColor: string;
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: generateId(),
      backgroundColor: '#ffffff',
      elements: [
        {
          id: generateId(),
          type: 'text',
          x: 50,
          y: 50,
          width: 700,
          height: 80,
          content: 'Welcome to Slides',
          style: { fontSize: 48, fontWeight: 'bold', color: '#1a1a2e' },
        },
        {
          id: generateId(),
          type: 'text',
          x: 50,
          y: 150,
          width: 600,
          height: 40,
          content: 'Click to add subtitle',
          style: { fontSize: 24, color: '#666666' },
        },
      ],
    },
    {
      id: generateId(),
      backgroundColor: '#f0f4f8',
      elements: [
        {
          id: generateId(),
          type: 'text',
          x: 50,
          y: 50,
          width: 300,
          height: 50,
          content: 'Slide 2',
          style: { fontSize: 36, fontWeight: 'bold', color: '#1a1a2e' },
        },
        {
          id: generateId(),
          type: 'shape',
          x: 400,
          y: 120,
          width: 150,
          height: 150,
          style: { backgroundColor: '#4285f4', borderRadius: 8 },
        },
      ],
    },
  ]);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [presentationName, setPresentationName] = useState('Untitled Presentation');
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    elementStartX: number;
    elementStartY: number;
  } | null>(null);

  const currentSlide = slides[currentSlideIndex];

  const addSlide = useCallback(() => {
    const newSlide: Slide = {
      id: generateId(),
      backgroundColor: '#ffffff',
      elements: [
        {
          id: generateId(),
          type: 'text',
          x: 50,
          y: 50,
          width: 300,
          height: 50,
          content: 'New Slide',
          style: { fontSize: 36, fontWeight: 'bold', color: '#1a1a2e' },
        },
      ],
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  }, [slides]);

  const deleteSlide = useCallback(() => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.min(currentSlideIndex, newSlides.length - 1));
  }, [slides, currentSlideIndex]);

  const addTextBox = useCallback(() => {
    const newElement: SlideElement = {
      id: generateId(),
      type: 'text',
      x: 100,
      y: 200,
      width: 200,
      height: 40,
      content: 'New text box',
      style: { fontSize: 18, color: '#333333' },
    };
    setSlides(slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
  }, [slides, currentSlideIndex]);

  const addShape = useCallback(() => {
    const newElement: SlideElement = {
      id: generateId(),
      type: 'shape',
      x: 300,
      y: 200,
      width: 100,
      height: 100,
      style: { backgroundColor: '#4285f4', borderRadius: 0 },
    };
    setSlides(slides.map((slide, index) =>
      index === currentSlideIndex
        ? { ...slide, elements: [...slide.elements, newElement] }
        : slide
    ));
    setSelectedElementId(newElement.id);
  }, [slides, currentSlideIndex]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: SlideElement) => {
    e.stopPropagation();
    setSelectedElementId(element.id);
    setDragState({
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      elementStartX: element.x,
      elementStartY: element.y,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    
    const dx = e.clientX - dragState.startX;
    const dy = e.clientY - dragState.startY;
    
    setSlides(slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.map(el =>
              el.id === dragState.elementId
                ? { ...el, x: dragState.elementStartX + dx, y: dragState.elementStartY + dy }
                : el
            ),
          }
        : slide
    ));
  }, [dragState, slides, currentSlideIndex]);

  const handleMouseUp = useCallback(() => {
    setDragState(null);
  }, []);

  const handleSlideClick = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  const updateElementContent = useCallback((elementId: string, content: string) => {
    setSlides(slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.map(el =>
              el.id === elementId ? { ...el, content } : el
            ),
          }
        : slide
    ));
  }, [slides, currentSlideIndex]);

  const deleteSelectedElement = useCallback(() => {
    if (!selectedElementId) return;
    setSlides(slides.map((slide, index) =>
      index === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.filter(el => el.id !== selectedElementId),
          }
        : slide
    ));
    setSelectedElementId(null);
  }, [slides, currentSlideIndex, selectedElementId]);

  return (
    <div className="min-h-screen flex flex-col" data-theme="corporate">
      {/* Header */}
      <div className="navbar bg-warning text-warning-content">
        <div className="flex-1 gap-2">
          <span className="text-xl font-bold">📽️ Slides</span>
          <input
            type="text"
            value={presentationName}
            onChange={(e) => setPresentationName(e.target.value)}
            className="input input-sm input-bordered bg-warning text-warning-content border-warning"
            placeholder="Presentation name"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-base-200 p-2 flex flex-wrap gap-1 items-center border-b">
        <button className="btn btn-sm btn-ghost" onClick={addSlide} title="New Slide">➕ Slide</button>
        <button className="btn btn-sm btn-ghost" onClick={deleteSlide} title="Delete Slide">🗑️</button>
        
        <div className="divider divider-horizontal mx-1"></div>
        
        <button className="btn btn-sm btn-ghost" onClick={addTextBox} title="Add Text Box">📝 Text</button>
        <button className="btn btn-sm btn-ghost" onClick={addShape} title="Add Shape">⬛ Shape</button>
        
        {selectedElementId && (
          <>
            <div className="divider divider-horizontal mx-1"></div>
            <button className="btn btn-sm btn-error" onClick={deleteSelectedElement} title="Delete Element">❌ Delete</button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-base-200 border-r overflow-y-auto p-2">
          <h3 className="text-sm font-semibold mb-2 px-2">Slides</h3>
          <ul className="menu menu-compact">
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <button
                  className={`${index === currentSlideIndex ? 'active' : ''}`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div
                    className="w-full aspect-video rounded border bg-base-100"
                    style={{ backgroundColor: slide.backgroundColor }}
                  >
                    <span className="text-xs">Slide {index + 1}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-8 bg-base-300">
          <div
            className="slide-canvas w-full max-w-4xl relative bg-base-100 shadow-xl"
            style={{ backgroundColor: currentSlide.backgroundColor }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleSlideClick}
          >
            {currentSlide.elements.map((element) => (
              <div
                key={element.id}
                className={`slide-element absolute ${
                  selectedElementId === element.id ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  left: element.x,
                  top: element.y,
                  width: element.width,
                  height: element.height,
                }}
                onMouseDown={(e) => handleElementMouseDown(e, element)}
              >
                {element.type === 'text' ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full h-full outline-none"
                    style={{
                      fontSize: element.style?.fontSize || 16,
                      fontWeight: element.style?.fontWeight || 'normal',
                      color: element.style?.color || '#000000',
                    }}
                    onBlur={(e) => updateElementContent(element.id, e.currentTarget.textContent || '')}
                  >
                    {element.content}
                  </div>
                ) : element.type === 'shape' ? (
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundColor: element.style?.backgroundColor || '#cccccc',
                      borderRadius: element.style?.borderRadius || 0,
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
