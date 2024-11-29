export function random(len: number){
    let option = "qwertyuiopasdfghjklzxcvbnm12345678";
    let lenght = option.length;

    let ans = "";
    for(let i = 0; i < len; i++){
        ans += option[Math.floor((Math.random() * lenght))]
    }
    return ans;
}