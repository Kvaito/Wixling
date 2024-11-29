export const biomes = [
    {
        id: 0,
        name: 'void',
        groundTexture:'/textures/wastesGround.jpg'
    },
    {
        id: 1,
        name: 'wastes',
        groundTexture:'/textures/wastesGround.jpg'
    },
    {
        id: 2,
        name: 'crystal',
        groundTexture:'/textures/wastesGround.jpg'
    }
]

export function getBiomeData(biomeId:number){
    return biomes.find(biome => biome.id === biomeId)??biomes[0];
}