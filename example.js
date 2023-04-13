import { check } from 'k6'
import smap from 'k6/x/smap'
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'



export const options = { 
    scenarios: {
        Async: {
            executor: 'ramping-arrival-rate',
            startRate: 1,
            timeUnit: '1s',
            preAllocatedVUs: 2,
            maxVUs: 2,
            stages: [
                { target: 1, duration: '30s' },
            ],
        }
    }
}

export function Setup(){
    const map = smap.create()
    //map.initSequential(10)
    return { map: map}
}


// export default function Simple() {
//     let uuid = uuidv4()
//     map.store(`${__VU}`,uuid)
//     let loadUUID = map.load(`${__VU}`)
//     check(loadUUID, {
//         'store': uuid === loadUUID[0],
//     });

//     map.delete(`${__VU}`,uuid)
//     loadUUID = map.load(`${__VU}`)
//     check(loadUUID, {
//         'delete': false === loadUUID[1],
//     })

//     map.loadOrStore(`${__VU}`,uuid)
//     loadUUID = map.load(`${__VU}`)
//     check(loadUUID, {
//         'load or store': uuid === loadUUID[0],
//     });

//     loadUUID = map.loadAndDelete(`${__VU}`,uuid)
//     check(loadUUID, {
//         'load and delete': uuid === loadUUID[0],
//     });
//     loadUUID = map.load(`${__VU}`)
//     check(loadUUID, {
//         'load and delete - second load': false === loadUUID[1],
//     });

//     loadUUID = map.load(`${__VU}`)
//     check(loadUUID, {
//         'load and delete - second load': false === loadUUID[1],
//     });

// }

export default function Async(data) {
    data.map.store(`user_${__VU}`,`user_${__VU}_${uuidv4()}`)
    console.log(`user_2`,data.map.sequential())
    // if(__VU == 2){
        
    //     map.store(`user_${__VU}`,`user_${__VU}_${uuidv4()}`)
    // }
    // if(__VU == 3){
    //     console.log(__VU)
    //     console.log(`user_2`,map.sequential())
    // }
}

// export function Sequential() {
//     map.initSequential(10)
//     for(var i = 0; i < 10; i++){
//         map.store(`user_${__VU}`,`user_${__VU}_${uuidv4()}`)
//     }
//     for(var i = 0; i < 10; i++){
//         console.log(`user_${__VU}`,map.sequential())
//     }
// }