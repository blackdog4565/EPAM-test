'use strict'
jQuery(document).ready(function ($) {

	class Product{
		constructor(name, count, price, id){
			this.name = name;
			this.count = count;
			this.price = price;
			this.id = id;	
		}
		
		writeHTML() { // вывод товаров
			$(".products").append('<ul id="product" class="product flex-row"><li class="product__attr product__name flex-row">'+ this.name +'</li><li class="product__count product__attr  flex-row">'+this.count+'</li>	'+
								'<li class="product__attr product__price">$'+this.price+'</li>'+ '<li class="product__attr product__id">'+this.id+'</li>' +
			          '<li class="product__attr product__action flex-row"><button class="button product__edit">Edit</button><button class="button product__delete">Delete</button></li></ul>')

		}
	}

	function make_product_list (products) { // для значения для начальных записей в таблице
		let product = [];

		for (let i = 0; i < products.length; i++) {
			let new_product = new Product(products[i][0],products[i][1],products[i][2],products[i][3]);
			product.push(new_product);
		}

		return product;
	}

	function re_write(product) { // обновление таблицы, если записи изменились
		$(".product").remove();
		write(product);
	}

	function write(product) { // вывод товаров
		for (let i = 0; i < product.length; i++) {
			if (!product[i]) {
				continue;
			}
			else {
				product[i].writeHTML();
			}
		}
	}

	let sort_check = 0; // для отслеживания положения сортировки

	let products = [["Товар 2",5,"12,200.50",1],["Товар 1",5,"9,600.25",2],["Товар 4",5,"11,353.25",3],["Товар 3",2,"7,100.00",4]]; // начальные значения товаров для примера	
	let product = make_product_list(products); 
	
	let new_id = -1;
	let top_pos = 0;
	write(product);

	$(".filter__button").click(function(){ // фильтрация
		let filter_word = $(this).siblings().val();
		if (filter_word) {
			$(".product").remove();
			for (var i = 0; i < product.length; i++) {
				if (product[i].name.toLowerCase().indexOf(filter_word) != -1) {
					product[i].writeHTML();
				}
			}
		}
	});

	$(".products__attr_name").click(function(){ // сортировка по имени
		sort_check += 1;

		if (sort_check % 2 == 0) {
			product.sort(function(a, b){
				let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
				if (nameA < nameB) 
				  return -1
				if (nameA > nameB)
				  return 1
				return 0 
			})	
			$(this).css("background-image", "url('img/str_up.png')");
		}
		else {
			product.sort(function(a, b){
				let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
				if (nameA < nameB) 
				  return 1
				if (nameA > nameB)
				  return -1
				return 0 
			})	
			$(this).css("background-image", "url('img/str_down.png')");
		}
		$(".products__attr_price").css("background-image", "url('img/str_right.png')");
		re_write(product);
	});

	$(".products__attr_price").click(function(){ // сортировка по цене
		sort_check += 1;

		if (sort_check % 2 == 0) {
			product.sort(function(a, b){
				let nameA = Number(a.price.replace(',','')), nameB = Number(b.price.replace(',',''));
				if (nameA < nameB) 
				  return -1
				if (nameA > nameB)
				  return 1
				return 0 
			})	
			$(this).css("background-image", "url('img/str_up.png')");
		}
		else {
			product.sort(function(a, b){
				let nameA = Number(a.price.replace(',','')), nameB = Number(b.price.replace(',',''));
				if (nameA < nameB) 
				  return 1
				if (nameA > nameB)
				  return -1
				return 0 
			})	
			$(this).css("background-image", "url('img/str_down.png')");
		}
		$(".products__attr_name").css("background-image", "url('img/str_right.png')");
		re_write(product);
	});

	$(document).on('click', '.product__edit',function(){ // отслеживание нажатия кнопки 'Edit'
		let edit_name = $(this).parent().siblings(".product__name").text();
		let edit_count = $(this).parent().siblings(".product__count").text();
		let edit_price = $(this).parent().siblings(".product__price").text();
		let edit_id = $(this).parent().siblings(".product__id").text();

		$(".add-update__name-input").val(edit_name);
		$(".add-update__count-input").val(edit_count);
		$(".add-update__price-input").val(edit_price);
		$(".add-update__id-input").val(edit_id);
		$(".add-update__button-but").text("Update");
	});

	$(document).on('click', '.product__delete',function(){ // отслеживание нажатия кнопки 'Delete'
		new_id = $(this).parent().siblings(".product__id").text();
		top_pos = $(this).position();

		$(".confirm-delete").css({"display":"block", "top":top_pos.top - 20, "left":top_pos.left - 80});
		$(".overlay").css({"display":"block"});

	});

	$(document).on('click', '.yes', function () { // отслеживание нажатия подтверждения на удаления товара
		for (let i = 0; i < product.length; i++) {
			if (product[i].id == new_id) {
				product.splice(i,1);
				re_write(product);
			}
		}
		$(".confirm-delete").css({"display":"none"})
		$(".overlay").css({"display":"none"})
	})

	$(document).on('click', '.no, .overlay', function () { // отслеживание отмены удаления товара
		$(".confirm-delete").css({"display":"none"})
		$(".overlay").css({"display":"none"})
	})

	$(document).on('click', '.add__button',function(){ // отслеживание нажатия формирования нового товара
		$(".add-update__button-but").text("Add");

		$(".add-update__name-input").val('');
		$(".add-update__count-input").val('');
		$(".add-update__price-input").val('');
		$(".add-update__id-input").val('');

		$(".add-update__name-input").focus();
	});

	$(document).on('click', '.add-update__button-but',function(){ // отслеживание нажатия добовления нового товара
		
		let new_name = $(".add-update__name-input").val();
		let new_count = $(".add-update__count-input").val();
		let new_price = $(".add-update__price-input").val();
		let new_id = $(".add-update__id-input").val();

		let check_id = 0;

		if ((new_name) && !(/^\s+$/.test(new_name))) {
			for (var i = 0; i < product.length; i++) {
				if (product[i].id == new_id) {
					let new_product = new Product(new_name, Number(new_count), new_price.slice(1), Number(new_id));
					product.push(new_product);

					product.splice(i,1);

					i = product.length + 2;

					check_id++;
				}
			}

			if (check_id != 1) {
				new_id = product.length + 1;

				let new_product = new Product(new_name, Number(new_count), new_price.slice(1), Number(new_id));
				product.push(new_product);

				check_id = 0;
			}

			$(".add-update__name-input").val('');
			$(".add-update__count-input").val('');
			$(".add-update__price-input").val('');
			$(".add-update__id-input").val('');

			$(".add-update__button-but").text("Add / Update");

			re_write(product);
		}
		else if (/^\s+$/.test(new_name)) { // проверка на ошибки при вводе значений
			$(".add-update__name-input").css({"border":"1px solid red"});
			let input_top = $(".add-update__name-input").position();
			$(".remove-space").css({"display":"block","top":input_top.top + 35, "left": input_top.left-65});
			$(".overlay").css({"display":"block"});
		}
		else if (!new_name) {
			$(".add-update__name-input").css({"border":"1px solid red"});
			let input_top = $(".add-update__name-input").position();
			$(".enter-the-name").css({"display":"block","top":input_top.top + 35, "left": input_top.left-65});
			$(".overlay").css({"display":"block"});
		}
		

	});

	$(document).on('click', '.remove-space__but-ok, .overlay', function () { 
		$(".remove-space, .enter-the-name").css({"display":"none"});
		$(".overlay").css({"display":"none"});
		$(".add-update__name-input").css({"border":"1px solid lightgrey"});
	})
});

	let formatter = new Intl.NumberFormat('en-US', { // для форматирвания цены
		style: 'currency',
		currency: 'USD',
	});

	$(".add-update__count-input").bind('input', function () { // запрет на ввод неправильных значений в поле количества товара
			console.log($(".add-update__count-input").val().search(/[a-z]/g))

		if ($(".add-update__count-input").val().search(/[^0-9]/g) > -1) {
			let a = $(".add-update__count-input").val();
			$(".add-update__count-input").val(a.replace(/[^0-9]/g,''))
			console.log(a)

		}
	})
	$(".add-update__count-input").bind('paste', function () { 
			console.log($(".add-update__count-input").val().search(/[a-z]/g))

		if ($(".add-update__count-input").val().search(/[^0-9]/g) > -1) {
			let a = $(".add-update__count-input").val();
			$(".add-update__count-input").val(a.replace(/[^0-9]/g,''))
			console.log(a)
		}
	})

	$(".add-update__price-input").bind('paste', function () { // запрет на добовления из буфера обмена неправильных значений в поле количества товара
		if ($(".add-update__price-input").val().search(/[^0-9.]/g) > -1) {
			let a = $(".add-update__price-input").val();
			$(".add-update__price-input").val(a.replace(/[^0-9.]/g,''))
		}
	})
	$(".add-update__price-input").bind('input', function () { // запрет на ввод неправильных значений в поле цены
		if ($(".add-update__price-input").val().search(/[^0-9.]/g) > -1) {
			let a = $(".add-update__price-input").val();
			$(".add-update__price-input").val(a.replace(/[^0-9.]/g,''))
			
			
		}
		if ($(".add-update__price-input").val().indexOf('.',$(".add-update__price-input").val().indexOf('.') + 1) > -1) { // проверка на количество точек в цене
			let a = $(".add-update__price-input").val();
			$(".add-update__price-input").val(a = a.slice(0,a.indexOf('.')+1))

		}
	})

	$(".add-update__price-input").focus(function () { 
		let b = $(".add-update__price-input").val()
		$(".add-update__price-input").val(b.slice(1).replace(',',''))
	})

	$(".add-update__price-input").focusout(function () { // форматирование при завершении редактирования
		let b = $(".add-update__price-input").val()
		b = formatter.format(b)

 		$(".add-update__price-input").val(b)
	})
