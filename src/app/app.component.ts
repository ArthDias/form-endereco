import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  title = 'form-endereco';

  cadastro: any = {
    nomeCompleto: "",
    dataNascimento: "",
    cpf: "",
    email: "",
    telefone: "",
    cep: ""
  }

  evento(event: any){
    return (event.target as HTMLInputElement).value
  }

  verificaValidTouched(campo: any){
    return !campo.valid && campo.touched
  }

  aplicaCSSValidoInvalido(campo: any){
    return {
      'is-invalid': !campo.valid && campo.touched,
      'is-valid': campo.valid && campo.touched
    }
  }

  isCpfValid(cpf: string) {
    // Remove caracteres não numéricos do CPF
    const cpfClean = cpf.replace(/\D/g, '');
    
    // Verifica se está vazio
    if (!cpf) {
      return false;
    }

    // Verifica se o CPF possui 11 dígitos
    if (cpfClean.length !== 11) {
      return false;
    }

    // Verifica se todos os dígitos do CPF são iguais (caso contrário, não é válido)
    if (/^(\d)\1{10}$/.test(cpfClean)) {
      return false;
    }

    // Calcula o primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfClean.charAt(9))) {
      return false;
    }

    // Calcula o segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpfClean.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) {
      remainder = 0;
    }
    if (remainder !== parseInt(cpfClean.charAt(10))) {
      return false;
    }

    // Se chegou até aqui, o CPF é válido
    return true;
  }

  consultaCEP(cep: any, form: any) {
    //Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
    //Verifica se campo cep possui valor informado.
    if (cep != "") {
      //Expressão regular para validar o CEP.
      var validacep = /^[0-9]{8}$/;

      //Reseta os dados de endereço do formulario
      this.resetaEnderecoForm(form)

      //Valida o formato do CEP.
      if(validacep.test(cep)) {
        
        this.http.get(`https://viacep.com.br/ws/${cep}/json`)
         .subscribe(dados => this.insereDadosEnderecoForm(dados, form))
      }
    }
  }

  resetaEnderecoForm (form: any) {
    form.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    })
  }

  //Insere os dados de endereço no formulário
  insereDadosEnderecoForm (dados: any, form: any) {
    form.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  //Reseta todos os campos do formulário
  resetaForm (form: any) {
    form.form.patchValue({
      nome: '',
      dataNascimento: '',
      cpf: '',
      email: '',
      telefone: '',
      endereco: {
        cep: '',
        numero: '',
        complemento: '',
        rua: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
    })
  }

  //Esse é o método usado para enviar o formulário
  onSubmit(form: any) {
    console.log(form)

    alert(
      'Formulário Enviado com o seguinte conteúdo:\n\n' +
        JSON.stringify(form.value, null, 2)
    );

    //reseta os estados do formulário
    form.resetForm();
    //evita erro com campos "null"
    this.resetaForm(form);
  }
}
