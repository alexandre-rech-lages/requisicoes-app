import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form : FormGroup;
  public formRecuperacao : FormGroup;

  private formBuilder: FormBuilder;
  private authService: AuthenticationService;
  private router: Router;
  private modalService: NgbModal;

  constructor(formBuilder: FormBuilder, authService: AuthenticationService,
    router: Router, modal: NgbModal){
    this.formBuilder=formBuilder;
    this.authService=authService;
    this.router=router;
    this.modalService=modal;
  }

  ngOnInit(): void {

    this.formRecuperacao = this.formBuilder.group({
      emailRecuperacao: new FormControl('')
    });

    this.form = this.formBuilder.group({
      email: new FormControl(''),
      senha: new FormControl('')
    });
  }

  get email() : AbstractControl | null{
    return this.form.get('email');
  }

  get senha() : AbstractControl | null{
    return this.form.get('senha');
  }

  get emailRecuperacao() : AbstractControl | null{
    return this.formRecuperacao.get('emailRecuperacao');
  }

  public async login(){
    const email = this.email?.value;
    const senha = this.senha?.value;

    console.log(email );
    console.log(senha);

    try{
      const resposta = await this.authService.login(email,senha);
      if(resposta?.user){
        this.router.navigate(['/painel']);
      }
    }
    catch(error){
        console.log(error);
    }

  }

  public abrirModalRecuperacao(modal: TemplateRef<any>){

    this.modalService.open(modal)
      .result
      .then( resultado =>{
        if (resultado === 'enviar'){
          this.authService.resetarSenha(this.emailRecuperacao?.value);
        }
      }, resultado => {
        console.log(resultado);
      })
      .finally(()=>{
        this.formRecuperacao.reset();
      })
  }
}
