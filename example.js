import { check } from 'k6'
import smap from 'k6/x/smap'
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js'



export const options = { 
  scenarios: {
    Single: {
        exec: 'Simple',
        executor: 'per-vu-iterations',
        vus: 1,
        iterations: 1,
    },
    Sequential: {
        exec: 'Sequential',
        executor: 'per-vu-iterations',
        vus: 2,
        iterations: 2,
      },
  }
}
let map = smap

export  function Simple() {
    let uuid = uuidv4()
    map.store(`${__VU}`,uuid)
    let loadUUID = map.load(`${__VU}`)
    check(loadUUID, {
        'store': uuid === loadUUID[0],
    });

    map.delete(`${__VU}`,uuid)
    loadUUID = map.load(`${__VU}`)
    check(loadUUID, {
        'delete': false === loadUUID[1],
    })

    map.loadOrStore(`${__VU}`,uuid)
    loadUUID = map.load(`${__VU}`)
    check(loadUUID, {
        'load or store': uuid === loadUUID[0],
    });

    loadUUID = map.loadAndDelete(`${__VU}`,uuid)
    check(loadUUID, {
        'load and delete': uuid === loadUUID[0],
    });
    loadUUID = map.load(`${__VU}`)
    check(loadUUID, {
        'load and delete - second load': false === loadUUID[1],
    });

    loadUUID = map.load(`${__VU}`)
    check(loadUUID, {
        'load and delete - second load': false === loadUUID[1],
    });

}
export  function Sequential() {
    map.initSequential(10)
    for(var i = 0; i < 10; i++){
        map.store(`user_${__VU}`,`user_${__VU}_${uuidv4()}`)
    }
    for(var i = 0; i < 10; i++){
        console.log(`user_${__VU}`,map.sequential())
    }
}