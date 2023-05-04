  /*
    --------------------------------------------------------------------------------------
    ############################ Funções comum ###########################################
   --------------------------------------------------------------------------------------
  */
  
  /* #### variavel global ### */
    var resultRec = 0;
    var resultDesp = 0;
    var dataAtualFormat= '';
    var dataPrimeiraFormat= '';
    var dataUltimaFormat= '';

    var id_proc=0;
    var trece= 0;
    var tdesp=0;
    var tcaixa=0;

  /*
     --------------------------------------------------------------------------------------
    formata data yyyy-mm-dd, ao carregar os inputs data
    --------------------------------------------------------------------------------------
  */
  const formatDataInput = () => {
    
    const date = new Date();
    
    const dataAtual = new Date(Date.now()).toLocaleString().split(',')[0];
    const AtualFormat = dataAtual.split('/');
    dataAtualFormat = AtualFormat[2]+'-'+AtualFormat[1]+'-'+AtualFormat[0];

    const dataPrimeira = new Date(date.getFullYear(), date.getMonth(), 1);
    const PrimeiraFormat = dataPrimeira.toLocaleDateString().split('/');
    dataPrimeiraFormat = PrimeiraFormat[2]+'-'+PrimeiraFormat[1]+'-'+PrimeiraFormat[0];

    const dataUltima = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const UltimaFormat = dataUltima.toLocaleDateString().split('/');
    dataUltimaFormat = UltimaFormat[2]+'-'+UltimaFormat[1]+'-'+UltimaFormat[0];

    document.getElementById("dataReceita").value = dataAtualFormat;
    document.getElementById("dataDespesa").value = dataAtualFormat;
    document.getElementById("dataInicio").value = dataPrimeiraFormat;
    document.getElementById("dataFim").value = dataUltimaFormat;
  }

  const LimparPesquisa = () => {
    document.location.reload(true);
  }
  /*
    --------------------------------------------------------------------------------------
    formata data dd-mm-yyyy, para carregar na lista
    --------------------------------------------------------------------------------------
  */
  const formatDataLista = (inputData) => {
    let data = new Date(inputData);
    let dataFormat = data.toLocaleDateString('pt-BR', {timeZone: 'UTC'});
    return dataFormat;
  }

  /*
    --------------------------------------------------------------------------------------
    função para formatar o campo input para decimal
    --------------------------------------------------------------------------------------
  */
  const formatMoedaInput = (a, e, r, t) => {
    let n = ""
      , h = j = 0
      , u = tamanho2 = 0
      , l = ajd2 = ""
      , o = window.Event ? t.which : t.keyCode;
    if (13 == o || 8 == o)
      return !0;
    if (n = String.fromCharCode(o),
    -1 == "0123456789".indexOf(n))
      return !1;
    for (u = a.value.length,
    h = 0; h < u && ("0" == a.value.charAt(h) || a.value.charAt(h) == r); h++)
      ;
    for (l = ""; h < u; h++)
      -1 != "0123456789".indexOf(a.value.charAt(h)) && (l += a.value.charAt(h));
    if (l += n,
    0 == (u = l.length) && (a.value = ""),
    1 == u && (a.value = "0" + r + "0" + l),
    2 == u && (a.value = "0" + r + l),
    u > 2) {
      for (ajd2 = "",
      j = 0,
      h = u - 3; h >= 0; h--)
        3 == j && (ajd2 += e,
        j = 0),
        ajd2 += l.charAt(h),
        j++;
      for (a.value = "",
      tamanho2 = ajd2.length,
      h = tamanho2 - 1; h >= 0; h--)
        a.value += ajd2.charAt(h);
      a.value += r + l.substr(u - 2, u)
    }
    return !1
  }

  /*
    --------------------------------------------------------------------------------------
    função para formatar campo da lista para decimal 
    --------------------------------------------------------------------------------------
  */
  const formatMoedaLista = (num) => {
    return (new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num));
  }

  /*
  --------------------------------------------------------------------------------------
   função para remover todas as linhas da lista
  --------------------------------------------------------------------------------------
  */
  const deleteRowsLista = (id_lista) => {
    try {
      var tableHeaderRowCount = 1;
      var table = document.getElementById(id_lista);
      var rowCount = table.rows.length;
      for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
      }
    }
    catch (e) {
      //exceções
    }
  }

  /*
  --------------------------------------------------------------------------------------
   função para pesquisar dados por periodo de data
  --------------------------------------------------------------------------------------
  */
  const buscaPeriodo = () => {
     
    let inputDataInicio = document.getElementById("dataInicio").value;
    let inputDataFim = document.getElementById("dataFim").value;

    getBuscaListaProcessado(inputDataInicio, inputDataFim);
  }
  
  /*
  --------------------------------------------------------------------------------------
   função para criar lista periodo
  --------------------------------------------------------------------------------------
  */
  const criarListaPeriodo = (id, data_i, data_f, total_rece, total_desp, total_caixa) => {
    
    var item = [id, data_i, data_f, formatMoedaLista(total_rece), formatMoedaLista(total_desp), formatMoedaLista(total_caixa)];
    var table = document.getElementById('periodo');
    table.className = "corTR";
    var row = table.insertRow();
  
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }

    criarBtnVisualizar(row.insertCell(-1), id);

    const svalor = (resultRec-resultDesp);
    if(parseFloat(svalor) < 0 ){
      cel.className ="corTD";
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um icone, de visaulizar itens do processamento
    --------------------------------------------------------------------------------------
  */
  const criarBtnVisualizar = (parent, id) => {
    
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "closeReceita";
    span.appendChild(txt);
    parent.appendChild(span);
 
    span.onclick = function () {

      let Element = this.parentElement.parentElement;
      const id = Element.getElementsByTagName('td')[0].innerHTML;
      
      if (confirm("Você tem certeza?")) {
        deleteRowsLista('receita');
        deleteRowsLista('despesa');
  
        deleteItemProcessar(id); 
        alert("Removido!"); 
       
        atualizaDespesaAberto(id);
        atualizaReceitaAberto(id);

        buscaPeriodo();

        setTimeout(getBuscaListaReceita(), 3000);
        setTimeout(getBuscaListaDespesa(), 3000);
        
      }
    }

    let spaco = document.createElement("span");
    let txt_ = document.createTextNode(" ");
    spaco.appendChild(txt_);
    parent.appendChild(spaco);

    let imgsrc = document.createElement("img");
    imgsrc.src = 'img/visualizar.png';
    imgsrc.width = 18;
    imgsrc.height = 14;
    imgsrc.title = 'Visualizar itens do processado'
    parent.appendChild(imgsrc);

    imgsrc.onclick = function () {

      let inputDataInicio = document.getElementById("dataInicio").value;
      let inputDataFim = document.getElementById("dataFim").value;

      let Element = this.parentElement.parentElement;
      id_proc = Element.getElementsByTagName('td')[0].innerHTML;
      trece = Element.getElementsByTagName('td')[3].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");
      tdesp = Element.getElementsByTagName('td')[4].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");
      tcaixa = Element.getElementsByTagName('td')[5].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");
      
      setTimeout(buscaPeriodoReceita(inputDataInicio, inputDataFim, id), 3000);
      setTimeout(buscaPeriodoDespesa(inputDataInicio, inputDataFim, id), 3000);
    }
  }

  /*
  --------------------------------------------------------------------------------------
   função para montar lista de resumo mensal
  --------------------------------------------------------------------------------------
  */
  const resumoMensal = () => {
    
    deleteRowsLista('resumo');

    var item = [formatDataLista(dataAtualFormat), formatMoedaLista(resultRec), formatMoedaLista(resultDesp), formatMoedaLista((resultRec-resultDesp))];
    var table = document.getElementById('resumo');
    
    var row = table.insertRow();
    row.className = "corTR";

    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }
   
    const svalor = (resultRec-resultDesp);
    if(parseFloat(svalor) < 0 ){
      cel.className ="corTD";
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para processar dados, via requisição POST
    --------------------------------------------------------------------------------------
  */
  const processarPeriodo = async () => {

    if (confirm("Você tem certeza, deseja processar este período?")) {
      
      var table_rec = document.getElementById('receita').getElementsByTagName("tr");
      if(table_rec.length < 2){
        alert("Tabela receita vazia, favor preencher a tabela");
        callback();
      }

      var table_desp = document.getElementById('despesa').getElementsByTagName("tr");
      if(table_desp.length < 2){
        alert("Tabela despesa vazia, favor preencher a tabela");
        callback();
      }

      if(resultRec == 0){
        alert("Valor total da receita, não pode ser 0, marque o 'status' pelo menos 1 item");
        callback();
      }

      if(resultDesp == 0){
        alert("Valor total da despesa, não pode ser 0, marque o 'status' pelo menos 1 item");
        callback();
      }

      let inputDataInicio = document.getElementById("dataInicio").value;
      let inputDataFim = document.getElementById("dataFim").value;
      
      const formData = new FormData();
      formData.append('data_i', inputDataInicio);
      formData.append('data_f', inputDataFim);
      formData.append('total_rece',resultRec);
      formData.append('total_desp', resultDesp);
      formData.append('total_caixa', (resultRec-resultDesp));
        
      let url = 'http://127.0.0.1:5000/processar';
      fetch(url, {
        method: 'post',
        body: formData
      })
      .then((response) => response.json())
      .then((data) => {   
        
        deleteRowsLista('receita');
        deleteRowsLista('despesa');

        atualizaIDProcReceita(data.id, inputDataInicio, inputDataFim)
        atualizaIDProcDespesa(data.id, inputDataInicio, inputDataFim)
        getBuscaListaProcessado(inputDataInicio, inputDataFim);  

        setTimeout(getBuscaListaReceita(), 3000)
        setTimeout(getBuscaListaDespesa(), 3000)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para buscar periodo de data da despesa 
    --------------------------------------------------------------------------------------
  */
  const getBuscaListaProcessado = (DataInicio, DataFim) => {
    
    deleteRowsLista('periodo');

    let url = 'http://127.0.0.1:5000/processado_periodo?datainicio=' + DataInicio + '&datafim=' + DataFim;
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
        data.processar.forEach(_item => criarListaPeriodo(_item.id,formatDataLista(_item.data_i), formatDataLista(_item.data_f),_item.total_rece,_item.total_desp,_item.total_caixa))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para atualizar total da receita e total da despesa processado
    --------------------------------------------------------------------------------------
  */
  const atualizaTotalProcessamento = (id_proc, xtrece, xtdesp, xtcaixa) => {

    let url = 'http://127.0.0.1:5000/processar_update?id_proc='+ id_proc +'&total_rece=' + xtrece +'&total_desp=' + xtdesp +'&total_caixa=' + xtcaixa ;
    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });

    trece = xtrece;
    tdesp = xtdesp;
    tcaixa = xtcaixa;
  }

  /*
    --------------------------------------------------------------------------------------
    Função para deletar itens da lista, e da tabela receitas, via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItemProcessar = (id) => {
    console.log(id)
    let url = 'http://127.0.0.1:5000/processar_deletar?id_proc=' + id;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    ############################ Funções para tabela receitas ############################
    --------------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------
    Função para adiciona, novo item a tabela receita
    --------------------------------------------------------------------------------------
  */
  const addNovaReceita = () => {
    
    let inputDescricao = document.getElementById("descricaoReceita").value;
    let inputData = document.getElementById("dataReceita").value;
    let inputValor = document.getElementById("valorReceita").value;

    if (inputDescricao === '') {
      alert("Digite a descrição do receita!");
    } else if (isNaN(parseFloat(inputValor))) {
      alert("Valor precisam ser númerico!");
    } else {
      postAddItemReceita(inputDescricao, inputData, inputValor);
      alert("Item adicionado com sucesso!");
      
      deleteRowsLista('receita');
      getBuscaListaReceita();
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar itens na lista receitas 
    --------------------------------------------------------------------------------------
  */  
  const criarListaReceita = (id, descricao, data, valor, status, processado) => {

    var item = [id, descricao, data, formatMoedaLista(valor)];
    var table = document.getElementById('receita');
    var row = table.insertRow();
    
    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }

    criarBtnReceitaStatus(row.insertCell(0), status, processado);
    criarBtnReceitaExcluir(row.insertCell(-1), processado); 
  
    document.getElementById("descricaoReceita").value = "";
    document.getElementById("valorReceita").value = "";
    
    if(status == 1){somaTotalReceita(valor);}
  }

  /*
    --------------------------------------------------------------------------------------
    Função para somar total da receita
    --------------------------------------------------------------------------------------
  */
  const somaTotalReceita = (valor) => {
    resultRec+=valor;
    if(resultRec < 0){resultRec = 0;}
    document.getElementById("totalReceita").innerHTML = formatMoedaLista(resultRec);

    resumoMensal();
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão, em cada item da lista receitas
    --------------------------------------------------------------------------------------
  */
  const criarBtnReceitaExcluir = (parent, processado) => {
    
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "closeReceita";
    span.appendChild(txt);
    parent.appendChild(span);

    span.onclick = function () {

      let Element = this.parentElement.parentElement;
      const id = Element.getElementsByTagName('td')[1].innerHTML;
      const valor_item = Element.getElementsByTagName('td')[4].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");
      
      if (confirm("Você tem certeza?")) {
        
        deleteItemReceita(id); 

        if(processado == true){  
          const ntotalrece = (trece-valor_item);
          const ntotalcaixa = (ntotalrece-tdesp);
          atualizaTotalProcessamento(id_proc,ntotalrece,tdesp,ntotalcaixa);
        }
        alert("Removido!"); 

        let inputDataInicio = document.getElementById("dataInicio").value;
        let inputDataFim = document.getElementById("dataFim").value;

        deleteRowsLista('receita');
        if(processado == true){buscaPeriodoReceita(inputDataInicio, inputDataFim, id_proc);buscaPeriodo();}else{getBuscaListaReceita();}
      }
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um checkbox, em cada item da lista receita, marcar como recebido
    --------------------------------------------------------------------------------------
  */
  const criarBtnReceitaStatus = (parent, status, ativar) => {
    
    var inputStatus = document.createElement("INPUT");
    inputStatus.setAttribute("type", "checkbox");
    inputStatus.className = "checkStatus";
    inputStatus.checked = status;
    if(ativar == true){inputStatus.setAttribute("disabled", "false");}
    parent.appendChild(inputStatus);
    
    inputStatus.onclick = function () {

      let Element = this.parentElement.parentElement;
      const id = Element.getElementsByTagName('td')[1].innerHTML;
      const valor = Element.getElementsByTagName('td')[4].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");

      var checked_up = 0;
      const todos_inputs = Element.getElementsByTagName('input'); 
      if(todos_inputs[0].checked == true){checked_up = 1;somaTotalReceita(parseFloat(valor));}else{somaTotalReceita(-parseFloat(valor));}
      atualizaStatusReceita(id, checked_up);
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para deletar itens da lista, e da tabela receitas, via requisição DELETE
    --------------------------------------------------------------------------------------
  */
  const deleteItemReceita = (id) => {
    console.log(id)
    let url = 'http://127.0.0.1:5000/receita?id=' + id;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para salva itens na lista e na tabela receitas, via requisição POST
    --------------------------------------------------------------------------------------
  */
  const postAddItemReceita = async (descricao, data, valor) => {

    const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('data', data);
    formData.append('valor', valor.replace(".","").replace(",","."));
  
    let url = 'http://127.0.0.1:5000/receita';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    Função para busca dados existente no servidor, via requisição GET
    --------------------------------------------------------------------------------------
  */
  const getBuscaListaReceita = async () => {

    resultRec=0;

    let url = 'http://127.0.0.1:5000/receitas';
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.receitas.length > 0){
        data.receitas.forEach(_item => criarListaReceita(_item.id,_item.descricao, formatDataLista(_item.data),_item.valor,_item.status,false))
      }else{
        somaTotalReceita(0);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para buscar periodo de data da receita 
    --------------------------------------------------------------------------------------
  */
  const buscaPeriodoReceita = (DataInicio, DataFim, id_proc) => {
    
    deleteRowsLista('receita');
    resultRec=0;

    let url = 'http://127.0.0.1:5000/receita_periodo?id_proc=' + id_proc + '&datainicio=' + DataInicio + '&datafim=' + DataFim;
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.receitas.length > 0){
        data.receitas.forEach(_item => criarListaReceita(_item.id,_item.descricao, formatDataLista(_item.data),_item.valor,_item.status, true))
      }else{
        somaTotalReceita(0);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para atualizar status da receita 
    --------------------------------------------------------------------------------------
  */
  const atualizaStatusReceita = (id, status) => {
    
    let url = 'http://127.0.0.1:5000/receita_update?id='+ id +'&status=' + status;
    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para atualizar campo id_proc, 
    --------------------------------------------------------------------------------------
  */
  const atualizaIDProcReceita = (id_proc, DataInicio, DataFim) => {

    let url = 'http://127.0.0.1:5000/receita_update_idProc?id_proc=' + id_proc + '&datainicio=' + DataInicio + '&datafim=' + DataFim;
    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para voltar a receita para aberto, apos deletetar processamento 
    --------------------------------------------------------------------------------------
  */
    const atualizaReceitaAberto = (id) => {
    
      let url = 'http://127.0.0.1:5000/receita_update_idProc_vazio?id_proc='+ id;
      fetch(url, {
        method: 'post',
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
      });
    }
  

  /*
    --------------------------------------------------------------------------------------
    ############################ Funções para tabela despesas ############################
    --------------------------------------------------------------------------------------
    --------------------------------------------------------------------------------------
    Função adiciona novo item a tabela despesas
    --------------------------------------------------------------------------------------
  */
  const addNovaDespesa = () => {
    
    let inputDescricao = document.getElementById("descricaoDespesa").value;
    let inputData = document.getElementById("dataDespesa").value;
    let inputValor = document.getElementById("valorDespesa").value;

    if (inputDescricao === '') {
      alert("Digite a descrição do despesa!");
    } else if (isNaN(parseFloat(inputValor))) {
      alert("Valor precisam ser númerico!");
    } else {
      postAddItemDespesa(inputDescricao, inputData, inputValor);
      alert("Item adicionado com sucesso!");
      deleteRowsLista('despesa');
      getBuscaListaDespesa(); 
    }
  }

  /*
  --------------------------------------------------------------------------------------
  Função para criar itens na lista despesas 
  --------------------------------------------------------------------------------------
  */
  const criarListaDespesa = (id, descricao, data, valor, status, processado) => {

    var item = [id, descricao, data, formatMoedaLista(valor)]
    var table = document.getElementById('despesa');
    var row = table.insertRow();

    for (var i = 0; i < item.length; i++) {
      var cel = row.insertCell(i);
      cel.textContent = item[i];
    }

    criarBtnDespesaStatus(row.insertCell(0), status, processado);
    criarBtnDespesaExcluir(row.insertCell(-1), processado)

    document.getElementById("descricaoDespesa").value = "";
    document.getElementById("valorDespesa").value = "";
    
    if(status == 1){somaTotalDespesa(valor);}
  }

  /*
    --------------------------------------------------------------------------------------
    Função para somar total da despesa
    --------------------------------------------------------------------------------------
  */
  const somaTotalDespesa = (valor) => {
    resultDesp+=valor;
    if(resultDesp < 0){resultDesp = 0;}
    document.getElementById("totalDespesa").innerHTML = formatMoedaLista(resultDesp);

    resumoMensal();
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um botão, em cada item da lista despesa
    --------------------------------------------------------------------------------------
  */
  const criarBtnDespesaExcluir = (parent, processado) => {
    
    let span = document.createElement("span");
    let txt = document.createTextNode("\u00D7");
    span.className = "closeDespesa";
    span.appendChild(txt);
    parent.appendChild(span);

    span.onclick = function () {
       
        let Element = this.parentElement.parentElement;
        const id = Element.getElementsByTagName('td')[1].innerHTML;
        const valor_item = Element.getElementsByTagName('td')[4].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");
       
        if (confirm("Você tem certeza?")) {
          
          deleteItemDespesa(id);

          if(processado == true){
            const ntotaldesp = (tdesp-valor_item);
            const ntotalcaixa = (trece-ntotaldesp);
            atualizaTotalProcessamento(id_proc,trece,ntotaldesp,ntotalcaixa);
          }

          alert("Removido!");

          let inputDataInicio = document.getElementById("dataInicio").value;
          let inputDataFim = document.getElementById("dataFim").value;

          deleteRowsLista('despesa');
          if(processado == true){buscaPeriodoDespesa(inputDataInicio, inputDataFim, id_proc);buscaPeriodo();}else{getBuscaListaDespesa();}
        }
    }
  }

  /*
    --------------------------------------------------------------------------------------
    Função para criar um checkbox, em cada item da lista despesa, marcar como paga
    --------------------------------------------------------------------------------------
  */
  function criarBtnDespesaStatus(parent, status, ativar) {
    
    var inputStatus = document.createElement("INPUT");
    inputStatus.setAttribute("type", "checkbox");
    inputStatus.className = "checkStatus";
    inputStatus.checked = status;
    if(ativar == true){inputStatus.setAttribute("disabled", "false");}
    parent.appendChild(inputStatus);

    inputStatus.onclick = function () {

      let Element = this.parentElement.parentElement;
      const id = Element.getElementsByTagName('td')[1].innerHTML;
      const valor = Element.getElementsByTagName('td')[4].innerHTML.replace("R$&nbsp;","").replace(".","").replace(",",".");

      var checked_up = 0;
      const todos_inputs = Element.getElementsByTagName('input');
      if(todos_inputs[0].checked == true){checked_up = 1;somaTotalDespesa(parseFloat(valor));}else{somaTotalDespesa(-parseFloat(valor));}
      atualizaStatusDespesa(id, checked_up);
    }
  }
  
  /*
  --------------------------------------------------------------------------------------
  Função para deletar itens da lista, e da tabela despesas, via requisição DELETE
  --------------------------------------------------------------------------------------
  */
  const deleteItemDespesa = (id) => {
    console.log(id)
    let url = 'http://127.0.0.1:5000/despesa?id=' + id;
    fetch(url, {
      method: 'delete'
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /*
  --------------------------------------------------------------------------------------
  Função para salva itens na lista e na tabela despesas, via requisição POST
  --------------------------------------------------------------------------------------
  */
  const postAddItemDespesa = async (descricao, data, valor) => {
    
    const formData = new FormData();
    formData.append('descricao', descricao);
    formData.append('data', data);
    formData.append('valor', valor.replace(".","").replace(",","."));

    let url = 'http://127.0.0.1:5000/despesa';
    fetch(url, {
      method: 'post',
      body: formData
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /*
  Função para busca dados existente no servidor, via requisição GET
  --------------------------------------------------------------------------------------
  */
  const getBuscaListaDespesa = async () => {
  
  resultDesp = 0;

  let url = 'http://127.0.0.1:5000/despesas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.despesas.length > 0){
        data.despesas.forEach(_item => criarListaDespesa(_item.id,_item.descricao, formatDataLista(_item.data),_item.valor,_item.status,false))
      }else{
        somaTotalDespesa(0);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para buscar periodo de data da despesa 
    --------------------------------------------------------------------------------------
  */
  const buscaPeriodoDespesa = (DataInicio, DataFim, id_proc) => {
    
    deleteRowsLista('despesa');
    resultDesp = 0;

    let url = 'http://127.0.0.1:5000/despesa_periodo?id_proc=' + id_proc + '&datainicio=' + DataInicio + '&datafim=' + DataFim;
    fetch(url, {
      method: 'get',
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.despesas.length > 0){
        data.despesas.forEach(_item => criarListaDespesa(_item.id,_item.descricao, formatDataLista(_item.data),_item.valor,_item.status,true))
      }else{
        somaTotalDespesa(0);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para atualizar status da despesas 
    --------------------------------------------------------------------------------------
  */
  const atualizaStatusDespesa = (id, status) => {
  
    let url = 'http://127.0.0.1:5000/despesa_update?id='+ id +'&status=' + status;
    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para atualizar campo id_proc, 
    --------------------------------------------------------------------------------------
  */
  const atualizaIDProcDespesa = (id_proc, DataInicio, DataFim) => {

    let url = 'http://127.0.0.1:5000/despesa_update_idProc?id_proc=' + id_proc + '&datainicio=' + DataInicio + '&datafim=' + DataFim;
    fetch(url, {
      method: 'post',
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
    });
  }

  /*
    --------------------------------------------------------------------------------------
    Função para voltar a despesa para aberto, apos deletetar processamento 
    --------------------------------------------------------------------------------------
  */
    const atualizaDespesaAberto = (id) => {
    
      let url = 'http://127.0.0.1:5000/despesa_update_idProc_vazio?id_proc='+ id;
      fetch(url, {
        method: 'post',
      })
        .then((response) => response.json())
        .catch((error) => {
          console.error('Error:', error);
      });
    }
  /*
  --------------------------------------------------------------------------------------
  chama a função, para carregar os dados na lista receitas,despesas e data
  --------------------------------------------------------------------------------------
  */
  document.addEventListener("DOMContentLoaded", function(e) {
    formatDataInput();
    getBuscaListaReceita();
    getBuscaListaDespesa();
  });
 