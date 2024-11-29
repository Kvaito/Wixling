export const wixes=[
    {
        id:1,
        name:'Eol',
        height:2.2,
        width:1.45,
        floatY:0.2
    },
    {
        id:2,
        name:'Liquice',
        height:1,
        width:1,
        floatY:0.4
    }
]

export function getWixDataById(id:number){
   return wixes.find(wix => wix.id === id)??wixes[0]
}