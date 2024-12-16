export const environments = [
    {
        id:1,
        name:'core_shard_1',
        height:1,
        width:1,
        textureUrl:'core_shard_1.png',
    },
    {
        id:2,
        name:'crystal_geyser_1',
        height:3,
        width:2,
        textureUrl:'crystal_geyser_1.png',
    },
    {
        id:3,
        name:'crystal_core_shard_1',
        height:1.65,
        width:2,
        textureUrl:'crystal_core_shard_1.png',
    },
    {
        id:4,
        name:'eol_burrow',
        height:8,
        width:6,
        textureUrl:'eol_burrow.png',
    }
]

export function getEnvironmentById(id:number){
    return environments.find(environment=>environment.id === id)??environments[0];
}