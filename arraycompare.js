// open your console

var array1 = ['A', 'B', 'C', 'D', 'D', 'E'];
var array2 = ['D', 'E'];
var index;

for (var i=0; i<array2.length; i++) {
    index = array1.indexOf(array2[i]);
    if (index > -1) {
        array1.splice(index, 1);
    }
}

console.log(array1); // ["A", "B", "C", "D"]