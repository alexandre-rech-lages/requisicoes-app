import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Observable} from 'rxjs';

import { Equipamento } from './models/equipamento.model';
import { EquipamentoService } from './services/equipamento.service';

@Component({
  selector: 'app-equipamento',
  templateUrl: './equipamento.component.html'
})
export class EquipamentoComponent implements OnInit  {

  public equipamentos$ : Observable<Equipamento[]>;
  public form : FormGroup;

  constructor(
    private equipamentoService: EquipamentoService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.equipamentos$ = this.equipamentoService.selecionarTodos();

    this.form = this.formBuilder.group({
      id: new FormControl(''),
      numeroSerie: new FormControl(''),
      nomeEquipamento: new FormControl(''),
      precoAquisicao: new FormControl(''),
      dataFabricacao: new FormControl('')
    });
  }


  public async abrir(modal : TemplateRef<any>, equipamento?: Equipamento){

    this.form.reset();

    if (equipamento)
      this.form.setValue(equipamento);

    try {

      await this.modalService.open(modal).result;

      if (!equipamento)
        await this.equipamentoService.inserir(this.form.value);
      else
        await this.equipamentoService.editar(this.form.value);

      this.toastrService.success('O equipamento foi gravado com sucesso', 'Cadastro de Equipamentos');
    }
    catch(error){

      if (error != 'fechar' && error != 0 && error != 1)
        this.toastrService.error('Falha ao tentar excluir o equipamento', 'Cadastro de Equipamentos');
    }
  }

  public async excluir(equipamento: Equipamento){
    await this.equipamentoService.excluir(equipamento);

    this.toastrService.success('O equipamento foi excluído', 'Cadastro de Equipamentos');
  }

  get id(){
    return this.form.get('id');
  }

  public get tituloPagina(){
    return this.id?.value ? 'Edição de Departamentos' : 'Novo Departamento';
  }

}
