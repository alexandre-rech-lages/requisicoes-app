import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'requisicoes-app';

  escreverNoConsole() : void{
    console.log('botão foi clicado');
  }

}
