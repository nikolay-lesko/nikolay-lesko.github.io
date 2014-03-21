function stringToArray(s) {
	if (!s)
		return [];

	if ($.type(s) !== 'string')
		return s;

	var arr = s.split(',');
	arr = $.map(arr, function (n) {
		return $.trim(n);
	});
	arr = $.grep(arr, function (n) {
		return n.length ? n : null;
	});

	return arr;
}