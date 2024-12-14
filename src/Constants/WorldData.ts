export type iChunkData = {
    id: number,
    position: { x: number, z: number },
    biome_id: number,
    entities: Array<iChunkEntityData>,
    props: Array<iChunkPropsData>,
    items: Array<iChunkItemsData>,
}

export type iChunkEntityData={
    entity_id: number,
    position: { x: number, z: number }
}

export type iChunkPropsData={
    props_id: number,
    position: { x: number, z: number },
}
export type iChunkItemsData={
    item_id: number,
    position: { x: number, z: number },
}

export const testWorld:Array<iChunkData>=[
    {
        id: 0,
        position: {x: 0, z: 0},
        biome_id: 1,
        entities: [{
            entity_id: 1,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 1,
                position: { x: 2, z: 3 }
            },
            {
                props_id: 1,
                position: { x: 6, z: 2 }
            },
            {
                props_id: 1,
                position: { x: 3, z: 7 }
            },
            {
                props_id: 1,
                position: { x: 8, z: 5 }
            },
        ],
        items: [],
    },
]

export const worldData: Array<iChunkData> = [
    {
        id: 0,
        position: {x: 0, z: 0},
        biome_id: 1,
        entities: [{
            entity_id: 1,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 1,
                position: { x: 2, z: 3 }
            },
            {
                props_id: 1,
                position: { x: 6, z: 2 }
            },
            {
                props_id: 1,
                position: { x: 3, z: 7 }
            },
            {
                props_id: 1,
                position: { x: 8, z: 5 }
            },
        ],
        items: [],
    },
    {
        id: 1,
        position: {x: 0, z: 1},
        biome_id: 1,
        entities: [{
            entity_id: 1,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 1,
                position: { x: 1, z: 3 }
            },
            {
                props_id: 1,
                position: { x: 2, z: 7 }
            }
        ],
        items: [],
    },
    {
        id: 2,
        position: {x: 1, z: 0},
        biome_id: 1,
        entities: [{
            entity_id: 1,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 1,
                position: { x: 0, z: 3 }
            },
            {
                props_id: 1,
                position: { x: 2, z: 7 }
            }
        ],
        items: [],
    },
    // {
    //     id: 3,
    //     position: {x: 1, z: 1},
    //     biome_id: 1,
    //     entities: [{
    //         entity_id: 1,
    //         position: {x: 2, z: 3}
    //     }
    //     ],
    //     props: [
    //         {
    //             props_id: 1,
    //             position: { x: 0, z: 3 }
    //         },
    //         {
    //             props_id: 1,
    //             position: { x: 2, z: 7 }
    //         }
    //     ],
    //     items: [],
    // },
    {
        id: 4,
        position: {x: -1, z: -1},
        biome_id: 2,
        entities: [{
            entity_id: 2,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 2,
                position: { x: 3, z: 3 }
            },
        ],
        items: [
            {
                item_id: 1,
                position: { x: 7, z: 8.5 }
            },
        ],
    },
    {
        id: 5,
        position: {x: 0, z: -1},
        biome_id: 2,
        entities: [
        ],
        props: [
            {
                props_id: 1,
                position: { x: 1, z: 3 }
            },
            {
                props_id: 2,
                position: { x: 7, z: 8 }
            },
            {
                props_id: 3,
                position: { x: 2, z: 7 }
            }
        ],
        items: [],
    },
    {
        id: 6,
        position: {x: -1, z: 0},
        biome_id: 2,
        entities: [{
            entity_id: 2,
            position: {x: 2, z: 3}
        }
        ],
        props: [
            {
                props_id: 3,
                position: { x: 4, z: 4 }
            },
            {
                props_id: 3,
                position: { x: 2, z: 7 }
            }
        ],
        items: [
            {
                item_id: 1,
                position: { x: 7, z: 8.5 }
            },
            {
                item_id: 1,
                position: { x: 8, z: 3 }
            },
            {
                item_id: 1,
                position: { x: 2, z: 5.32 }
            },
        ],
    },
]

