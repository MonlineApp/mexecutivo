/*-------------------------------------------------------------------------------------
'simuladorv2.js
'Descri��o: Fun��es para simula��o de dist�ncia utilizando a API Vers�o 3(LABS) do Google Maps
'Vers�o: 2.0.0
'Criado Em: 29/05/2010
'Ultima Atualiza��o: 17/05/2010
'Autor: Marciel Torres / Mario Wittler
'Empresa: Construtiva Internet Software
-------------------------------------------------------------------------------------*/
//Define vari�veis globais
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map, distanciaValue, response;
var cont = "0";

function calcRoute() {
	//limpa qualquer resultado de rota que foi exibido.
	if((directionsDisplay!= null)||(directionsDisplay!= undefined)){directionsDisplay.setPanel(null);}
	
	//Monta Mapa e suas propriedades
	directionsDisplay = new google.maps.DirectionsRenderer();
	var myOptions = {
		zoom:5,
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}, 
		mapTypeId: google.maps.MapTypeId.ROADMAP,
	}
	map = new google.maps.Map(document.getElementById("Mapa"), myOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById("Rota"));
	var origem = document.getElementById("origem").value;
	var destino = document.getElementById("destino").value;

	//Monta propriedades da rota
	var request = {
	    origin:origem, //valor origem
	    destination:destino, //valor destino
	    provideRouteAlternatives: true, //rotas sugeridas
	    travelMode: google.maps.DirectionsTravelMode.DRIVING //tipo de viagem(dirigindo)    
	};

	//Busca resultados da rota
	directionsService.route(request, function(response, status) {
	if (status == google.maps.DirectionsStatus.OK) {
		directionsDisplay.setDirections(response);
	  
		//Define qual rota deve carregar
		if (cont!="0"){directionsDisplay.setRouteIndex(cont);}

	   //Oculta rotas sugeridas
	   directionsDisplay.hideRouteList = true;

	   //Monta select com todas as rotas
	   rotas = response.routes;
	   var i;
	   var comborotas = document.getElementById('SelectRoutes');
		comborotas.options.length=0;
		for(i=0;i<rotas.length;i++){
			comborotas.options.length++;
			comborotas.options[i].text = rotas[i].summary;
			comborotas.options[i].value = i;
		}
		comborotas.options[cont].selected = true;
		document.getElementById("sRotaNome").innerText = rotas[cont].summary;

		//a propriedade dist�ncia utiliza duas propriedades: Value para c�lculos e Text para layout
		distanciaValue = rotas[cont].legs[0].distance.value / 1000;
		distanciaText = rotas[cont].legs[0].distance.text;	    
	    tempo = rotas[cont].legs[0].duration.text;

		//seta o valor de origem e o valor de destino retornados pelo maps
		start = rotas[0].legs[0].start_address;
		end = rotas[0].legs[0].end_address;

		//Monta Resultado
		document.getElementById('divResultado').style.display='';
		document.getElementById('MapasRotas').style.display='';
		document.getElementById('resultsorigem').innerHTML = start;
		document.getElementById('resultsdestino').innerHTML = end;
		document.getElementById('resultsdistancia').innerHTML = distanciaText;
		document.getElementById('resultstempo').innerHTML = tempo;
		setCursor(document.simulador.Velocidade);

		CalculaTempo();
	  }
	  else{
	  	//Caso n�o consiga carregar a rota ent�o exibe mensagem de erro.
	  	alert(MSGSIM001);
	  }
	});
}

function Recalcular(){
	//Fun��o para recalcular o tempo e a dist�ncia conforme a escolha de rota no campo select.
	cont = document.simulador.SelectRoutes.selectedIndex; 
	calcRoute();  
	}

function localizacao(){
	//Fun��o para pegar a localiza��o atrav�s do IP de quem acessa a p�gina.
	var pais = geoip_country_name();
	var cidade = geoip_city();
	var estado = geoip_region_name();
	if((pais!='') && (cidade!='') && (estado!='')){
		var local = cidade + "," + estado + "," + pais;
		document.simulador.origem.value = local;
	}
	document.simulador.origem.focus(); 
}

function CalculaTempo(){
	//Fun��o que calcula o tempo em rela��o a velocidade
	var velocidade = document.simulador.Velocidade.value;
	//distancia = distancia.replace(",",".");
	
	//Faz c�lculo do tempo e limita a duas casas depois da v�rgula
	var total = distanciaValue / velocidade;
	total = total.toFixed(2);
	
	//seta o campo TempoVariavel com o valor do tempo formatado 
	document.getElementById('TempoVariavel').innerHTML = FormataTempo(total);	 	
}

function FormataTempo(tempo){
	//Fun��o que formata hora em HH:MM
	var horas, minutos, texto, texto2, texto3, texto4, texto5, texto6;
	
	//Pega parte inteira do n�mero e transforma a parte decimal em mintuos
	horas = parseInt(tempo);
	minutos = Math.round((tempo-horas)*60);
	
	//faz consist�ncias para modificar o texto formatado dependendo da quantidade de horas e minutos
	if(horas>1){texto2="s";}else{texto2="";}
	if(minutos>1){texto3="s";}else{texto3="";}
	if(horas>0){texto4= horas + " hora" + texto2;texto6=" e ";}else{texto4="";texto6="";}
	if(minutos>0){texto5=texto6 + minutos + " minuto"+ texto3;}else{texto5="";}
	
	//cria vari�vel para exibi��o do tempo formatado, e retorna seu valor para fun��o
	texto = texto4 + texto5;
	return texto;			
}

function setCursor(el) { 
	//fun��o para trazer o texto do campo passado como par�metro j� selecionado
	if(el.setSelectionRange) { 
		el.focus(); 
		el.setSelectionRange(0,3); 
	} else { 
		if(el.createTextRange) { 
			range=el.createTextRange(); 
			range.collapse(true); 
			range.moveEnd('character',3); 
			range.moveStart('character',0); 
			range.select(); 
		} 
	} 
}