import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { Departamento } from '../departamentos/models/departamento.model';
import { DepartamentoService } from '../departamentos/services/departamento.service';
import { Funcionario } from './models/funcionario.model';
import { FuncionarioService } from './services/funcionario.service';

@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
})
export class FuncionarioComponent implements OnInit {

  public funcionarios$ : Observable<Funcionario[]>;
  public departamentos$ : Observable<Departamento[]>;

  public form: FormGroup;

  constructor(
    private funcionarioService: FuncionarioService,
    private departamentoService: DepartamentoService,
    private formBuilder : FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      id: new FormControl(''),
      nome: new FormControl(''),
      email: new FormControl(''),
      funcao: new FormControl(''),
      departamentoId: new FormControl(''),
      departamento: new FormControl('')
    });

    this.funcionarios$ = this.funcionarioService.selecionarTodos();
    this.departamentos$ = this.departamentoService.selecionarTodos();
  }

  public async abrir(modal : TemplateRef<any>, funcionario?: Funcionario){

    this.form.reset();

    if (funcionario)
      this.form.setValue(funcionario);

    try {

      await this.modalService.open(modal).result;

      if (!funcionario)
        await this.funcionarioService.inserir(this.form.value);
      else
        await this.funcionarioService.editar(this.form.value);

      this.toastrService.success('O funcionario foi gravado com sucesso', 'Cadastro de Funcionarios');
    }
    catch(error){

      if (error != 'fechar' && error != 0 && error != 1)
        this.toastrService.error('Falha ao tentar excluir o funcionario', 'Cadastro de Funcionarios');
    }
  }

  public async excluir(funcionario: Funcionario){
    await this.funcionarioService.excluir(funcionario);

    this.toastrService.success('O funcionario foi excluído', 'Cadastro de Funcionarios');
  }

  get id(){
    return this.form.get('id');
  }

  public get tituloPagina(){
    return this.id?.value ? 'Edição de Departamentos' : 'Novo Departamento';
  }

}
