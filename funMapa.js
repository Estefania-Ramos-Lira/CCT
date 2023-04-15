    function mostrarMapa(centrosCCT) {
        // Crear el objeto de mapa
        var mapa = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: new google.maps.LatLng(23.634501, -102.552784),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        // Crear los marcadores

        var infowindow = new google.maps.InfoWindow();

        var marcadores = [];
        centrosCCT.forEach(function (centro) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(centro.LATITUD, centro.LONGITUD),
                map: mapa,
                title: centro.NOMBRE
            });
    
            var contenidoInfoWindow = '<div><h3>' + centro.NOMBRE + '</h3><p>Nivel: ' + centro.NIVEL + '</p></div>';
    
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(contenidoInfoWindow);
                infowindow.open(mapa, marker);
            });
    
            marcadores.push(marker);
        });
    
        return marcadores;
    }

    function filtrarCentrosCCT(centrosCCT, nivelSeleccionado,nivel2Seleccionado,nivel3Seleccionado, sostenimientoSeleccionado) {
        return centrosCCT.filter(function (centro) {
            return (nivelSeleccionado == '' || centro.NIVEL == nivelSeleccionado) && 
                (nivel2Seleccionado == '' || centro.NIVEL2 == nivel2Seleccionado) &&
                (nivel3Seleccionado == '' || centro.NIVEL3 == nivel3Seleccionado) &&            
                (sostenimientoSeleccionado == '' || centro.SOSTENIMIENTO == sostenimientoSeleccionado);
        });
    }

    window.onload = function () {
        fetch('cttjson.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var marcadores = mostrarMapa(data);
                var form = document.getElementById('formulario-filtros');
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    var nivelSeleccionado = form.nivel.value;
                    var nivel2Seleccionado = form.nivel2.value;
                    var nivel3Seleccionado = form.nivel3.value;
                    var sostenimientoSeleccionado = form.sostenimiento.value;
                    var centrosFiltrados = filtrarCentrosCCT(data, nivelSeleccionado,nivel2Seleccionado,nivel3Seleccionado, sostenimientoSeleccionado);
                    marcadores.forEach(function (marcador) {
                        marcador.setMap(null);
                    });
                    var nuevosMarcadores = mostrarMapa(centrosFiltrados);
                    marcadores = nuevosMarcadores;
                });
            });
    };
