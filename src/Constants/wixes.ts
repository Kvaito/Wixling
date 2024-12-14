export type iWixDataType={
    id:number,
    name:string,
    height:number,
    width:number,
    floatY:number,
    data:any
}

export const wixes:Array<iWixDataType>=[
    {
        id:1,
        name:'Eol',
        height:2.2,
        width:1.45,
        floatY:0.2,
        data:{
            mini:{
                height:0.7,
                width:0.7,
                floatY:0,
                imageSrc:'/entity/wixesVar/EolMini.png'
            }
        }
    },
    {
        id:2,
        name:'Liquice',
        height:1,
        width:1,
        floatY:0.4,
        data:{}
    }
]

export function getWixDataById(id:number){
   return wixes.find(wix => wix.id === id)??wixes[0]
}