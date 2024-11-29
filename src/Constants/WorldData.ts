export type iChunkData = {
    id: number,
    position: { x: number, z: number },
    biome_id: number,
    entities: Array<{
        entity_id: number,
        position: { x: number, z: number },
    }>,
    props: Array<{
        props_id: number,
        position: { x: number, z: number },
    }>,
    items: Array<any>,
}

export const worldData: Array<iChunkData> = [
    {
        id: 0,
        position: {x: 0, z: 0},
        biome_id: 0,
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
    {
        id: 1,
        position: {x: 0, z: 1},
        biome_id: 0,
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
    {
        id: 2,
        position: {x: 1, z: 0},
        biome_id: 0,
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
    {
        id: 3,
        position: {x: 1, z: 1},
        biome_id: 0,
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
    }
]

