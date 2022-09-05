import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../auth/services/authentication.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css']
})
export class PainelComponent implements OnInit, OnDestroy {
  public emailUsuario?: string | null;
  public usuarioLogado$: Subscription;
  private authService: AuthenticationService;
  private router: Router;

  constructor(auth: AuthenticationService, router: Router){
    this.router=router;
    this.authService=auth;
  }

  // setup
  ngOnInit(): void {
    this.usuarioLogado$ = this.authService.usuarioLogado
        .subscribe(usuario => this.emailUsuario = usuario?.email);
  }

  //cleanup
  ngOnDestroy(): void {
    this.usuarioLogado$.unsubscribe();
  }

  public sair(){
    this.authService.logout().then(() => console.log(this.emailUsuario));
    this.router.navigate(['/login']);
  }

}
