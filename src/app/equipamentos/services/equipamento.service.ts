import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {


  private registros : AngularFirestoreCollection<Equipamento>;

  constructor(private fireStore: AngularFirestore) {
    this.registros = fireStore.collection<Equipamento>('equipamentos');
  }

  public selecionarTodos() : Observable<Equipamento[]> {
    return this.registros.valueChanges();
  }

  public async inserir(registro: Equipamento) : Promise<void> {

    if (!registro)
      return Promise.reject('Equipamento inválido');

    const res = await this.registros.add(registro);

    registro.id = res.id;

    this.registros.doc(res.id).set(registro);
  }

  public async editar(registro: Equipamento) : Promise<void> {
    return this.registros.doc(registro.id).set(registro);
  }

  public async excluir(registro: Equipamento) : Promise<void> {
    return this.registros.doc(registro.id).delete();
  }

}
