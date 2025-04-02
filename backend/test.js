// const sort = (arr) => {
//     let n = arr.length;
//     for (let i = 0; i < n - 1; i++) {
//         for (let j = 0; j < n - i - 1; j++) {
//             if (arr[j] > arr[j + 1]) {
//                 [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//             }
//         }
//     }
//     return arr;
// }

// console.log(sort([60, 40, 69, 65, 55, 86, 81, 3, 99, 83, 6, 70, 80, 2, 66, 98]));


// function generateRandomArray(size, min, max) {
//     return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
// }


// function findMaxSumArray(arrays) {
//     let maxSumArray = arrays[0];
//     let maxSum = 0;

//     for (let i = 0; i < arrays.length; i++) {
//         let currentSum = 0;

//         for (let j = 0; j < arrays[i].length; j++) {
//             currentSum += arrays[i][j];
//         }

//         if (currentSum > maxSum) {
//             maxSum = currentSum;
//             maxSumArray = arrays[i];
//         }
//     }

//     return maxSumArray;
// }

// function findArrayWithOneAndNinetyNine(arrays) {
//     let result = [];

//     for (let i = 0; i < arrays.length; i++) {
//         let hasOne = false, hasNinetyNine = false;

//         for (let j = 0; j < arrays[i].length; j++) {
//             if (arrays[i][j] === 1) hasOne = true;
//             if (arrays[i][j] === 99) hasNinetyNine = true;
//         }

//         if (hasOne && hasNinetyNine) {
//             result.push(arrays[i]);
//         }
//     }

//     return result;
// }

// const arrays = Array.from({ length: 100 }, () => generateRandomArray(5, 1, 100));

// const maxSumArray = findMaxSumArray(arrays);

// const arraysContainingOneAndNinetyNine = findArrayWithOneAndNinetyNine(arrays);

// console.log("Mảng có tổng lớn nhất:", maxSumArray);
// console.log("Các mảng chứa cả 1 và 99:", arraysContainingOneAndNinetyNine);


// Cho mảng 2 chiều A[n][n]. Thực hiện:
// Khởi tạo với n là 10. các phần tử đều là số ngẫu nhiên nằm trong khoảng 1 tới 100000 và không được trùng nhau 
// Tìm vị trí tất cả các số nguyên tố trong mảng 

// Hàm kiểm tra số nguyên tố
// function isPrime(num) {
//     if (num < 2) return false;
//     for (let i = 2; i <= Math.sqrt(num); i++) {
//         if (num % i === 0) return false;
//     }
//     return true;
// }

// function generateUniqueNumbers(count, min, max) {
//     const numbers = new Set();
//     while (numbers.size < count) {
//         numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
//     }
//     return Array.from(numbers);
// }

// const n = 10;
// const uniqueNumbers = generateUniqueNumbers(n * n, 1, 100000);
// const A = [];
// for (let i = 0; i < n; i++) {
//     A.push(uniqueNumbers.slice(i * n, (i + 1) * n));
// }

// const primePositions = [];
// for (let i = 0; i < n; i++) {
//     for (let j = 0; j < n; j++) {
//         if (isPrime(A[i][j])) {
//             primePositions.push({ row: i, col: j, value: A[i][j] });
//         }
//     }
// }

// console.log("Mảng 2D A:");
// console.table(A);
// console.log("Vị trí các số nguyên tố:",primePositions);
// console.table(primePositions);

// SELECT 
//     svm.msv,
//     ROUND(SUM(latest_scores.diem * mh.tin_chi) / SUM(mh.tin_chi), 2) AS diem_trung_binh
// FROM (
//     SELECT msv, ma_mon, diem
//     FROM SinhVien_MonHoc
//     WHERE (msv, ma_mon, lan_thi) IN (
//         -- Lấy lần thi gần nhất của mỗi môn học
//         SELECT msv, ma_mon, MAX(lan_thi) AS latest_attempt
//         FROM SinhVien_MonHoc
//         WHERE msv = 'uni123'
//         GROUP BY msv, ma_mon
//     )
// ) AS latest_scores
// JOIN MonHoc mh ON latest_scores.ma_mon = mh.ma_mon
// GROUP BY svm.msv;

