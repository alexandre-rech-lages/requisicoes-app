import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Departamento } from './models/departamento.model';
import { DepartamentoService } from './services/departamento.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html'
})
export class DepartamentoComponent implements OnInit {

  public departamentos$ : Observable<Departamento[]>;
  public form: FormGroup;

  constructor(
    private departamentoService: DepartamentoService,
    private modalService: NgbModal,
    private formBuider : FormBuilder
  ){}

  ngOnInit(): void {
    this.departamentos$ = this.departamentoService.selecionarTodos();

    this.form = this.formBuider.group({
      id: new FormControl(''),
      nome: new FormControl(''),
      telefone: new FormControl('')
    });
  }

  public async gravar(modal:TemplateRef<any>, departamento?: Departamento){

    this.form.reset();

    if (departamento)
      this.form.setValue(departamento);

    try {

      await this.modalService.open(modal).result;

      if (!departamento)
        await this.departamentoService.inserir(this.form.value);
      else
        await this.departamentoService.editar(this.form.value);

      console.log('O departamento foi salvo com sucesso');

    } catch (error) {

    }
  }

  public async excluir(departamento: Departamento){
    await this.departamentoService.excluir(departamento);
  }

  public get tituloPagina(){
    return this.id?.value ? 'Edição de Departamentos' : 'Novo Departamento';
  }

  get id(){
    return this.form.get('id');
  }

  get nome(){
    return this.form.get('nome');
  }

  get telefone(){
    return this.form.get('telefone');
  }

}
