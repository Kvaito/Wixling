import Vue from 'vue'
import Vuex from 'vuex'
import {child, get, getDatabase, ref, set, update} from "firebase/database";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentUser: '',
        userTeam: '',
        enemy: '',
        attackList: 'none',
        wixUserHp: '',
        wixEnemyHp: '',
        character: '',
        dex:''
    },
    mutations: {
        setUser(state, user) {
            state.currentUser = user
        },
        setUserTeam(state, team) {
            state.userTeam = team
        },
        setEnemyTeam(state, team) {
            state.enemy = team
        },
        setAttackList(state, attackList) {
            state.attackList = attackList
        },
        setEnemyHp(state, hp) {
            state.wixEnemyHp = hp
        },
        setUserHp(state, hp) {
            state.wixUserHp = hp
        },
        updateWixSafe(state, wixSafe) {
            state.character.caughtWixling = wixSafe
        },
        setCharacter(state, char) {
            state.character = char
        },
        setCharacterMoney(state, money) {
            state.character.money = money
        },
        setCharacterEssence(state, essence) {
            state.character.essence = essence
        },
        setDex(state,dex){
            state.dex=dex
        },
        meh() {
            return 1
        }
    },
    actions: {
        // eslint-disable-next-line no-unused-vars
        async registerUser({commit}, personData) {
            console.log(personData)
            const db = getDatabase();
            await set(ref(db, 'users/' + 'user' + personData.id), {personData});
            await set(ref(db, 'users/' + 'user' + personData.id + '/characterData/'), {
                character1: {
                    id: personData.id * 3 + 1,
                    slot: 1,
                    busy: 'false'
                },
                character2: {
                    id: personData.id * 3 + 2,
                    slot: 2,
                    busy: 'false'
                },
                character3: {
                    id: personData.id * 3 + 3,
                    slot: 3,
                    busy: 'false'
                },
            });
            console.log(personData.id)
        },
        async createCharacter({getters}, characterData) {
            console.log(characterData)
            let user = getters.getCurrentUser
            const db = getDatabase();
            set(ref(db, 'users/' + 'user' + user.personData.id + '/characterData/character' + characterData.charSlot),
                {
                    id: characterData.id,
                    nickname: characterData.nickname,
                    slot: characterData.charSlot,
                    look: characterData.look,
                    busy: 'true',
                    sex: characterData.sex,
                    money: 1000,
                    essence: 0,
                    teamWixling: {
                        "1_MemberIdInSafe": {
                            id: 0,
                            busy: 'false'
                        },
                        "2_MemberIdInSafe": {
                            id: 0,
                            busy: 'false'
                        },
                        "3_MemberIdInSafe": {
                            id: 0,
                            busy: 'false'
                        },
                    },
                    caughtWixling: {},
                    inventory: {
                        item1: {
                            itemId: 0,
                            count: 12
                        },
                        item2: {
                            itemId: 1,
                            count: 2
                        },
                        item3: {
                            itemId: 2,
                            count: 29
                        }
                    }
                });
        },
        async setEnemyTeam({commit}, enemyTeam) {
            commit('setEnemyTeam', enemyTeam)
        },
        async setCharacter({commit}, character) {
            const db = ref(getDatabase())
            await get(child(db, 'users/user' + this.state.currentUser.personData.id + '/characterData/character' + localStorage.activeCharacter))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        character = snapshot.val();
                    }
                })
            commit('setCharacter', character)
        },
        async setCharacterMoney({commit}, money) {
            const db = getDatabase();
            await update(ref(db, 'users/user' + this.state.currentUser.personData.id + '/characterData/character' + localStorage.activeCharacter),
                {money: money})
            commit('setCharacterMoney', money)
        },
        async setCurrentUser({commit}, user) {
            commit('setUser', user)
            localStorage.currentUser = user.personData.nickname
        },
        async setUserTeam({commit}, team) {
            commit('setUserTeam', team)
        },
        async setAttackList({commit}, attackList) {
            attackList = Object.values(attackList)
            commit('setAttackList', attackList)
        },
        async setEnemyHp({commit}, hp) {
            await commit('setEnemyHp', hp)
        },
        async setUserHp({commit}, hp) {
            await commit('setUserHp', hp)
        },
        async setWixInSafe({commit}, wix) {
            const db = getDatabase();
            await set(ref(db, 'users/user' + this.state.currentUser.personData.id + '/characterData/character' + localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + wix.id), {
                idInDex: wix.idInDex,
                nickname: wix.nickname,
                hp: wix.hp,
                status: '',
                implantsId: {
                    implant1: {implantId: 0, busy: "false", id: 1},
                    implant2: {implantId: 0, busy: "false", id: 2},
                    implant3: {implantId: 0, busy: "false", id: 3},
                    implant4: {implantId: 0, busy: "false", id: 4},
                },
                id: wix.id,
                essenceGot: 0,
                learnedAttack: {
                    line1: {
                        attack1: {
                            learned: true,
                        },
                        attack2: {
                            learned: false,
                        },
                        attack3: {
                            learned: false,
                        },
                        attack4: {
                            learned: false,
                        },
                    },
                    line2: {
                        attack1: {
                            learned: false,
                        },
                        attack2: {
                            learned: false,
                        },
                        attack3: {
                            learned: false,
                        },
                        attack4: {
                            learned: false,
                        },
                    },
                    line3: {
                        attack1: {
                            learned: false,
                        },
                        attack2: {
                            learned: false,
                        },
                        attack3: {
                            learned: false,
                        },
                        attack4: {
                            learned: false,
                        },
                    },
                    line4: {
                        implantAttack: {
                            learned: false
                        }
                    }
                }
            });
            commit('meh')
        },
        async setItemInInventory({commit}, item) {
            const db = getDatabase();
            await set(ref(db, 'users/user' + this.state.currentUser.personData.id + '/characterData/character' + localStorage.activeCharacter + '/inventory/item' + item.id), {
                itemId: item.itemId,
                count: item.count,
                id: item.id,
                title: item.title,
                active: 'false'
            });
            commit('meh')
        },
        async setCharacterEssence({commit}, essence) {
            const db = getDatabase();
            await update(ref(db, 'users/user' + this.state.currentUser.personData.id + '/characterData/character' + localStorage.activeCharacter),
                {essence: essence})
            commit('setCharacterMoney', essence)
        },
        async setDex({commit}) {
            const db = ref(getDatabase())
            let dex=''
            await get(child(db, 'wixlings'))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        dex = snapshot.val();
                    }
                })
            commit('setDex', dex)
        },
    },
    modules: {},
    getters: {
        getCurrentUser: state => {
            return state.currentUser;
        },
        getUserTeam: state => {
            return state.userTeam
        },
        getEnemy: state => {
            return state.enemy
        },
        getAttackList: state => {
            return state.attackList
        },
        getEnemyHp: state => {
            return state.wixEnemyHp
        },
        getUserHp: state => {
            return state.wixUserHp
        },
        getCharacter: state => {
            return state.character
        },
        getDex:state => {
            return state.dex
        }
    }
})
