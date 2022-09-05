import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import { Departamento } from 'src/app/departamentos/models/departamento.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  private registros : AngularFirestoreCollection<Funcionario>;

  constructor(private fireStore: AngularFirestore) {
    this.registros = fireStore.collection<Funcionario>('funcionarios');
  }

  public selecionarTodos() : Observable<Funcionario[]> {
    return this.registros.valueChanges()
      .pipe(
        map( (funcionarios : Funcionario[]) =>{
            funcionarios.forEach( f => {
              this.fireStore
                .collection<Departamento>('departamentos')
                .doc(f.departamentoId)
                .valueChanges()
                .subscribe(x => f.departamento = x);
            });

            return funcionarios;
        })
      );
  }

  public async inserir(registro: Funcionario) : Promise<void> {

    if (!registro)
      return Promise.reject('Funcionario inválido');

    const res = await this.registros.add(registro);

    registro.id = res.id;

    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Funcionario) : Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public async excluir(registro: Funcionario) : Promise<void> {
    return this.registros.doc(registro.id).delete();
  }
}
