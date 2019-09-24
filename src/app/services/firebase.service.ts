import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: AngularFirestore) { }

  crear(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('usuarios')
        .add(data)
        // tslint:disable-next-line: arrow-return-shorthand
        .then(res => { resolve(res); }, err => reject(err));
    });
  }

  Get() {
    return this.firestore.collection('usuarios').snapshotChanges();
  }

  GetBy(campo, cedula) {
    // tslint:disable-next-line: radix
    if (campo === 'cda') {
      cedula = parseInt(cedula)
    }
    return this.firestore.collection<any>('usuarios', ref => ref.where(campo.toString(), '==', cedula)).snapshotChanges();
  }

  update(data, usuarios) {
    console.log('data', data);

    return this.firestore
      .collection('usuarios')
      .doc(data[0].payload.doc.id)
      .set(usuarios, { merge: true });
  }



  delete(data) {
    console.log('data', data);

    return this.firestore
      .collection('usuarios')
      .doc(data[0].payload.doc.id)
      .delete();
  }


}
