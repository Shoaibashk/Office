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
          x: 60,
          y: 80,
          width: 680,
          height: 80,
          content: 'Welcome to Slides',
          style: { fontSize: 48, fontWeight: 'bold', color: '#1f2937' },
        },
        {
          id: generateId(),
          type: 'text',
          x: 60,
          y: 180,
          width: 600,
          height: 40,
          content: 'Create beautiful presentations with ease',
          style: { fontSize: 24, color: '#6b7280' },
        },
      ],
    },
    {
      id: generateId(),
      backgroundColor: '#f8fafc',
      elements: [
        {
          id: generateId(),
          type: 'text',
          x: 60,
          y: 60,
          width: 300,
          height: 50,
          content: 'Key Features',
          style: { fontSize: 36, fontWeight: 'bold', color: '#1f2937' },
        },
        {
          id: generateId(),
          type: 'shape',
          x: 420,
          y: 140,
          width: 120,
          height: 120,
          style: { backgroundColor: '#3b82f6', borderRadius: 12 },
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
          x: 60,
          y: 60,
          width: 300,
          height: 50,
          content: 'New Slide',
          style: { fontSize: 36, fontWeight: 'bold', color: '#1f2937' },
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
      style: { fontSize: 18, color: '#374151' },
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
      style: { backgroundColor: '#3b82f6', borderRadius: 8 },
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
    <div className="min-h-screen flex flex-col bg-base-200">
      {/* Header */}
      <header className="navbar bg-gradient-to-r from-warning to-warning/90 text-warning-content shadow-lg">
        <div className="flex-1 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <span className="text-xl">📽️</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Slides</span>
          </div>
          <input
            type="text"
            value={presentationName}
            onChange={(e) => setPresentationName(e.target.value)}
            className="input input-sm bg-white/10 border-white/20 text-warning-content placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 w-64 font-medium"
            placeholder="Presentation name"
          />
        </div>
        <div className="flex-none gap-2">
          <button className="btn btn-sm bg-white/20 border-0 text-warning-content hover:bg-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Present
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-base-100 px-4 py-2 flex items-center gap-1 border-b border-base-300 shadow-sm">
        <div className="join">
          <button className="btn btn-sm btn-ghost join-item gap-1" onClick={addSlide} title="New Slide">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Slide
          </button>
          <button className="btn btn-sm btn-ghost join-item" onClick={deleteSlide} title="Delete Slide">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        
        <div className="divider divider-horizontal mx-2 h-6"></div>
        
        <div className="join">
          <button className="btn btn-sm btn-ghost join-item gap-1" onClick={addTextBox} title="Add Text Box">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            Text
          </button>
          <button className="btn btn-sm btn-ghost join-item gap-1" onClick={addShape} title="Add Shape">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
            Shape
          </button>
        </div>
        
        {selectedElementId && (
          <>
            <div className="divider divider-horizontal mx-2 h-6"></div>
            <button className="btn btn-sm btn-error gap-1" onClick={deleteSelectedElement} title="Delete Element">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Delete
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-base-100 border-r border-base-300 overflow-y-auto p-3">
          <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3 px-1">Slides</h3>
          <div className="space-y-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`w-full p-1 rounded-lg transition-all ${
                  index === currentSlideIndex 
                    ? 'ring-2 ring-warning ring-offset-2' 
                    : 'hover:bg-base-200'
                }`}
                onClick={() => setCurrentSlideIndex(index)}
              >
                <div
                  className="slide-thumbnail bg-base-100 shadow-sm border border-base-300"
                  style={{ backgroundColor: slide.backgroundColor }}
                >
                  <div className="p-2 text-left">
                    <span className="text-[10px] font-medium text-base-content/80">Slide {index + 1}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex-1 flex items-center justify-center p-8 overflow-auto">
          <div
            className="slide-canvas w-full max-w-4xl relative"
            style={{ backgroundColor: currentSlide.backgroundColor }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleSlideClick}
          >
            {currentSlide.elements.map((element) => (
              <div
                key={element.id}
                className={`slide-element absolute transition-shadow ${
                  selectedElementId === element.id 
                    ? 'ring-2 ring-warning ring-offset-2' 
                    : ''
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
                    className="w-full h-full shadow-md"
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
