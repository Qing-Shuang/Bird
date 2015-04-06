	window.onload = function(){
		var h2Arrays = document.getElementsByTagName("h2");
		if(h2Arrays.length > 1 && h2Arrays[0].textContent){
			var mul = document.createElement("ul");
			for(var i = 0;i < h2Arrays.length;++i){
				var mli = document.createElement("li");
				mli.textContent = h2Arrays[i].textContent;
				mul.appendChild(mli);
			}
			var mdiv = document.createElement("div");
			mdiv.id = "calcOfArticle";
			mdiv.appendChild(mul);

			//var mbody = document.getElementsByTagName("body");
			h2Arrays[0].parentNode.insertBefore(mdiv,h2Arrays[0]);
		}
	}