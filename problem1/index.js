var sum_to_n_a = function (n) {
	let result = 0;
	for (let i = 1; i <= n; i++) {
		result = result + i;
	}
	return result;
};

var sum_to_n_b = function (n) {
	let result = (n * (n + 1)) / 2;
	return result;
};

var sum_to_n_c = function (n) {
	let result = Array.from({ length: n }, (_, index) => index + 1).reduce((acc, curr) => acc + curr, 0);
	return result;
};
