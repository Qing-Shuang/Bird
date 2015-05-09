	window.onload = function(){
		var h1Arrays = document.getElementsByTagName("h1");
		var h2Arrays = document.getElementsByTagName("h2");
		if(h2Arrays.length > 1 && h2Arrays[0].textContent){
			var mul = document.createElement("ul");
			var mtx = document.createTextNode("目录");
			mul.appendChild(mtx);
			for(var i = 0;i < h2Arrays.length;++i){
				var mli = document.createElement("li");
				mli.textContent = h2Arrays[i].textContent;
				mul.appendChild(mli);
			}
			var mdiv = document.createElement("div");
			mdiv.id = "calcOfArticle";
			mdiv.appendChild(mul);
			
			var mnext = h1Arrays[0].nextSibling;
			var ma = mnext.childNodes[1];
			if(ma && ma.tagName.toLowerCase() == "a"){
				mnext.parentNode.insertAfter(mdiv,mnext);
			}
			else{
				mnext.parentNode.insertBefore(mdiv,mnext);
			}
			//h2Arrays[0].parentNode.insertBefore(mdiv,h2Arrays[0]);
		}
	}
