import {useDroppable} from "@dnd-kit/core";
import {horizontalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import React from "react";
import SortableItem from "./SortableItem.jsx";

const Tier = ({id, title, color, items}) => {
    const {setNodeRef, isOver} = useDroppable({
        id,
        data: {type: 'tier', title}
    });

    return (
        <div className={`flex ${isOver ? 'ring-2 ring-white' : ''}`}>
            <div className={`w-20 ${color} flex items-center justify-center font-bold text-2xl text-black`}>
                {title}
            </div>
            <div
                ref={setNodeRef}
                className="flex-1 bg-gray-700 min-h-[80px] flex items-center p-2"
            >
                <SortableContext items={items.map(item => item.id)} strategy={horizontalListSortingStrategy}>
                    <div className="flex gap-1 flex-wrap">
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} item={item}/>
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};

export default Tier;