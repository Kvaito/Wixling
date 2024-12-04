export const items=[
    {
        id:0,
        name:'nUlL iTeM',
        textureUrl:'',
        height:0.2,
        width:0.2
    },
    {
        id:1,
        name:'Core piece',
        textureUrl:'core_piece.png',
        height:0.2,
        width:0.2
    }
]

export function getItemById(id:number){
    return items.find(item=>item.id === id)??items[0];
}