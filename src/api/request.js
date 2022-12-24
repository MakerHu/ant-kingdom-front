import {Service} from "./service";
export function getConfigsByProductId(productId) {
    return Service({
        url: '/manager/getConfigsByProductId',
        params: { productId: productId }
    })
}
export function getAllAndroidPlugins() {
    return Service({
        url: '/manager/getAndroidPlugin ',
        method: 'get'
    })
}
export function addNewAndroidPlugin(data) {
    return Service({
        url: '/manager/addAndroidPlguin',
        data: JSON.stringify(data)
    })
}

export function getRoomList() {
    return Service({
        url: '/api/room/getRoomList',
        method: 'post'
    })
}


export function createRoom(roomName) {
    return Service({
        url: '/api/room/addRoom',
        method: 'post',
        params: { roomName: roomName }
    })
}
