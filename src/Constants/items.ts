export type iItemData={
    id:number,
    name:string,
    textureUrl:string,
    height:number,
    width:number
}

export const gameItems:Array<iItemData>=[
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
    return gameItems.find(item=>item.id === id)??gameItems[0];
}