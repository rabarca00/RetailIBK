import { Component, OnInit  } from '@angular/core';
declare var $: any;
declare var firebase: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
}) 


export class AppComponent implements OnInit {
  ngOnInit(){

  $.fn.getpage = function(page){

    var ref = firebase.database().ref("clientes");

    ref.on("value", function(data) {
      var data1 = {
             "page":page,
             "total_pages": Math.ceil(Object.keys(data.val()).length/6), 
             "per_page":6,
             "data":data.val() 
      }
      $(".pagination li").not("#first,#last").remove()
      $(".pagination li a").off("click")
      for(var i=1;i<=data1["total_pages"];i++){   
        $("<li><a data-page='"+i+"' href='#'>"+i+"</a></li>").insertBefore($(".pagination li").last())
      }
      $(".pagination #last a").attr("data-page",data1["total_pages"])
      $(".pagination li a").on("click",function(e){
          $.fn.getpage($(e.target).attr("data-page"))
      })
      $("#tableP tr").not("#head").remove()
      var offset = (data1["page"]-1) * data1["per_page"]
      i = 0 
      Object.keys(data1["data"]).filter(function(v,i){return Math.ceil((i+1)/6)==data1["page"]}).forEach(function(xi){
        var v = data1["data"][xi]
        $("#tableP").append($("<tr><td>"+(offset+i+1)+".</td><td>"+v["nombres"]+"</td><td>"+v["apellidos"]+"</td><td>"+v["fechanac"]+"</td><td>"+v["edad"]+"</td><td><button id='edit' class='btn btn-success btn-xs' type='button' data-id='"+xi+"' >Editar</button>&nbsp;<button id='detail' class='btn btn-primary btn-xs' type='button' data-id='"+xi+"' >An&aacute;lisis</button>&nbsp;<button id='delete' class='btn btn-danger btn-xs' type='button' data-id='"+xi+"' >Eliminar</button></td>"))
        i++;
      });
      $("#tableP #detail").on("click",function(e){
        $.fn.getclient($(e.target).attr("data-id"))
      })
      $("#tableP #edit").on("click",function(e){
        $.fn.updateclient($(e.target).attr("data-id"))
      })
      $("#tableP #delete").on("click",function(e){
        if(confirm("Desea Eliminar Registro "+$(e.target).attr("data-id")+"?")){
          $.fn.deleteclient($(e.target).attr("data-id"))
        }
      })


   }, function (error) {
    console.log("Error: " + error.code);
   });
    
  } 

  $.fn.newclient = function(){

    $("div#client-detail").show();
    $("div#client-report").hide();

    $("div#field001").hide();
    $("div#field003").hide();    

    $(".box-footer .btn-primary").show();
    $(".box-footer .btn-primary").off("click");
    $("#field001 input").val("") 
    $("#field001 input").prop("readonly", false);
    $("#client-detail h3").text("Nuevo Cliente") 

    $("div#field001").show();

    $(".box-footer .btn-primary").on("click",function(){
      if(confirm("Desea crear Nuevo Registro?")){
        $.fn.savenewclient()

      }
    });

  } 
  $.fn.reportclient = function(){

    $("div#client-detail").hide();
    $("div#client-report").show();
    $("div#field001").hide();
    $("div#field003").hide();    

    $(".box-footer .btn-primary").show();
    $(".box-footer .btn-primary").off("click");
    $("#field001 input").val("") 
    $("#field001 input").prop("readonly", false);
    $("#client-detail h3").text("Reporte de Clientes") 

    $("#client-report .badge").text("") 
    $("#client-detail h3").text("Reporte de Clientes") 

    var ref = firebase.database().ref("clientes");

    ref.on("value", function(data) {

      var v = Object.keys(data.val())
      var prom =v.reduce(function(a,v,i){return Number(data.val()[v]["edad"])+a},0)/v.length
      $("#client-report #total").text(v.length)
      $("#client-report #promedio").text(prom)
      $("#client-report #stddev").text(Math.sqrt(v.map(function(v){return(Math.pow(data.val()[v]["edad"]-prom,2))}).reduce(function(a,v,i){return a+v},0)/v.length ))
      $(".box-footer .btn-primary").prop("disable", false);

    });




  } 


  $.fn.updateclient = function(client){

    $("div#client-detail").show();
    $("div#client-report").hide();

    $("div#field001").show();
    $("div#field003").hide();    
    $(".box-footer .btn-primary").show();
    $(".box-footer .btn-primary").prop("disable", true);;

    $("#field001 input").prop("readonly", false);

    $(".box-footer .btn-primary").off("click");

    $("#client-detail h3").text("Actualizar Cliente: "+ client) 

    $(".box-footer .btn-primary").on("click",function(){
      if(confirm("Desea Actualizar Registro "+client+"?")){
        $.fn.putclient(client)
      }
    });
    
    var ref = firebase.database().ref("clientes/"+client);

    ref.on("value", function(data) {
      var v = data.val()
      $("#field001 #nombres").val(v["nombres"])
      $("#field001 #apellidos").val(v["apellidos"])
      $("#field001 #fechanac").val(v["fechanac"])
      $("#field001 #edad").val(v["edad"])
      $(".box-footer .btn-primary").prop("disable", false);;
  

    });


 } 


  $.fn.savenewclient = function(){

    var txtClient = {}

    $("#field001 input").each(function(index){
      txtClient[this.id] = $(this).val();
    });

    var ref = firebase.database().ref("clientes");

    ref.push( txtClient, function(error) {
      if(!error){
        alert("Registro Nuevo grabado Exitosamente.")
      }else{
        alert("Registro con error:"+status)
      }

    });
   

  } 

  $.fn.putclient = function(client){

    var txtClient = {}


    $("#field001 input").each(function(index){
      txtClient[this.id] = $(this).val();
    });


    var ref = firebase.database().ref("clientes/"+client);

    ref.update( txtClient, function(error) {
      if(!error){
        alert("Registro Nuevo grabado Exitosamente.")
      }else{
        alert("Registro con error:"+status)
      }

    });
   
  }

  $.fn.deleteclient = function(client){




    var ref = firebase.database().ref("clientes/"+client);

    ref.remove( function(error) {
      if(!error){
        alert("Registro Nuevo eliminado Exitosamente.")
      }else{
        alert("Registro con error:"+status)
      }
    });
  }

  $.fn.getclient = function(client){

    $("div#client-detail").show();
    $("div#client-report").hide();

    $("div#field001, .box-footer .btn-primary").hide();
    $("div#field001").show();
    $("div#field003").show();    

    $("#field001 input").prop("readonly", true);
    $("#field001 input").val("") 
    $("#client-detail h3").text("Detalle de Cliente: "+ client) 


    var ref = firebase.database().ref("clientes");

    var ds = 0 
    ref.on("value", function(data) {

      var v = Object.keys(data.val())
      var prom =v.reduce(function(a,v,i){return Number(data.val()[v]["edad"])+a},0)/v.length
      ds = Math.sqrt(v.map(function(v){return(Math.pow(data.val()[v]["edad"]-prom,2))}).reduce(function(a,v,i){return a+v},0)/v.length )

    });

    var ref = firebase.database().ref("clientes/"+client);

    ref.on("value", function(data) {
      var v = data.val()
      $("#field001 #nombres").val(v["nombres"])
      $("#field001 #apellidos").val(v["apellidos"])
      $("#field001 #fechanac").val(v["fechanac"])
      $("#field001 #edad").val(v["edad"])
      $("#field003 #fchdec").val(75+ds)
      $(".box-footer .btn-primary").prop("disable", false);;
  
      

    });
  } 

  $(document).ready(function(){
    $.fn.getpage(1)

    $("div#client-detail").hide();
    $("div#client-report").hide();
    $("#new-client").on("click",function(e){
      $.fn.newclient()
    }) 
    $("#report-client").on("click",function(e){
      $.fn.reportclient()
    }) 
   });
   }
  }