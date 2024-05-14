import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'form-endereco';
  
  //Esse é o método usado para enviar o formulário
  onSubmit(form: any) {
    console.log(form)
  }
}
