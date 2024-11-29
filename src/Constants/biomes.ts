import {chunkSize} from "~/src/Constants/gameConstants";

export const biomes = [
    {
        id: 0,
        name: 'void',
        groundWrapping:100,
        groundTexture:'/textures/wastesGround.jpg'
    },
    {
        id: 1,
        name: 'wastes',
        groundWrapping:chunkSize,
        groundTexture:'/textures/wastesGround.jpg'
    },
    {
        id: 2,
        name: 'crystal',
        groundWrapping:chunkSize/2,
        groundTexture:'/textures/crystalGround.jpg'
    }
]

export function getBiomeData(biomeId:number){
    return biomes.find(biome => biome.id === biomeId)??biomes[0];
}