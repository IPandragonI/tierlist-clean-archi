import {useDraggable} from "@dnd-kit/core";

const SortableItem = ({id, item}) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id,
        data: {type: 'item', item}
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
    } : {};

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`relative group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
        >
            <img
                src={item.imageUrl}
                alt={item.title}
                title={item.title}
                className="w-16 h-16 object-cover"
            />
        </div>
    );
};

export default SortableItem;