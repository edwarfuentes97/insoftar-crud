import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/models/global.service';
import Usuario from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.css']
})
export class UsuariosFormComponent implements OnInit {

  panelOpenState: boolean;
  foods: any;
  selected;
  myForm: FormGroup;
  public formulario: FormGroup;
  lcGuardando: boolean;
  // aplicar interface de usuario
  lcUsuario = {};
  lcEditando: boolean;
  respuestaUsuarios: any;
  preUsuario: any;
  respuestaEmail: any;

  // tslint:disable: variable-name
  constructor(public firebaseS: FirebaseService, private router: Router, private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute, private globalService: GlobalService) {
    this.fnCapturarID();
    this.initForms();

  }

  ngOnInit() {
    this.panelOpenState = false;
    // tslint:disable-next-line: no-unused-expression
  }

  fnEditar() {
    this.lcGuardando = !this.lcGuardando;
    this.initForms();
  }

  fnCancelar() {
    this.lcGuardando = !this.lcGuardando;
    this.initForms();
  }

  private fnCapturarID(): any {
    this.activatedRoute.params.subscribe(params => {
      if (params.id !== null && params.id !== 'new') {
        this.fnBuscarUsuario(params.id);
        // this.lcGuardando = true;
        this.lcEditando = true;
        this.fnCancelar();
      } else {
        this.lcGuardando = true;
        this.lcEditando = false;
        this.fnCancelar();
      }
    });
  }

  initForms() {
    this.formulario = this._fb.group({
      // tslint:disable: no-string-literal
      Nombres: [{ value: this.lcUsuario['nme'], disabled: this.lcGuardando }, [Validators.required]],
      Apellidos: [{ value: this.lcUsuario['apl'], disabled: this.lcGuardando }, [Validators.required]],
      Cedula: [{ value: this.lcUsuario['cda'], disabled: this.lcGuardando }, [Validators.required]],
      Correo: [{ value: this.lcUsuario['crr'], disabled: this.lcGuardando }, [Validators.required, Validators.email]],
      Telefono: [{ value: this.lcUsuario['tel'], disabled: this.lcGuardando }, [Validators.required]],
      Activo: [{ value: this.lcUsuario['act'], disabled: this.lcGuardando }, [Validators.required]],

      // company: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      // email: ['', [Validators.required, Validators.email]],
    });
  }

  fnValidarValores(): any {
    if (this.formulario.valid) {
      this.fnGuardar();
    } else {
      this.openSnackBar('Ocurio un error', 'ERROR');
    }
  }


  async fnGuardar() {

    // console.log('cedula y correo que retorna', cedula[0]['cda'] , ' - ' , email[0]['crr']) ;
    // console.log('cedula y correo lc Usar', this.lcUsuario['cda'], '  -  ', this.lcUsuario['crr']);

    if (this.lcEditando) {
      console.log('Editando');

      this.firebaseS.update(this.respuestaUsuarios, this.lcUsuario).then(res => {
        this.openSnackBar('Registro actualizado con exito', 'EXITO');
        this.fnCancelar();
        this.router.navigate(['/usuarios']);
      });

    } else {
      const email = await this.fnBuscarValidaEmail(this.lcUsuario['crr']);
      const cedula = await this.fnBuscarValida(this.lcUsuario['cda']);

      if (cedula[0]) {
        this.openSnackBar('la cedula ya existe', 'Error');
        return;
      }
      if (email[0]) {
        this.openSnackBar('el correo ya existe', 'Error');
        return;
      }

      console.log('creando');

      this.firebaseS.crear(this.lcUsuario)
        .then(res => {
          console.log('creado con exito');
          this.openSnackBar('Registro creado con exito', 'EXITO');
          this.fnCancelar();
          this.router.navigate(['/usuarios']);
        });
    }




  }

  // fnGuardar() {

  //   if (this.lcEditando) {

  //     this.globalService.update(this.lcUsuario).subscribe(resp => {
  //       if (resp['code'] === 200) {
  //         this.openSnackBar('Registro actualizado con exito', 'EXITO');
  //         this.fnCancelar();
  //         this.router.navigate(['/usuarios']);
  //       } else {
  //         this.openSnackBar('Ocurrio un error ' + resp['data'], 'ERROR');
  //       }
  //     })
  //   } else {

  //     this.globalService.save(this.lcUsuario).subscribe(resp => {
  //       if (resp['code'] === 200) {
  //         this.openSnackBar('Registro insertado con exito', 'EXITO');
  //         this.fnCancelar();
  //         this.router.navigate(['/usuarios']);
  //       } else {
  //         this.openSnackBar('Ocurrio un error ' + resp['data'], 'ERROR');
  //       }
  //     });
  //   }


  // }

  // fnBuscarUsuario(id) {
  //   this.globalService.getBy(id).subscribe(resp => {
  //     if (resp['code'] !== 200) {
  //       this.openSnackBar(' Ocurrio un error ' + resp.data, 'ERROR');
  //     } else {
  //       this.lcUsuario = resp.data;
  //     }
  //   });
  // }



  fnBuscarUsuario(cedula) {
    const dataTotal = [];
    this.firebaseS.GetBy('cda', cedula)
      .subscribe(res => {
        this.respuestaUsuarios = res;
        this.respuestaUsuarios.forEach(objeto => {
          dataTotal.push(objeto.payload.doc.data());
        });
        this.lcUsuario = dataTotal[0];
        this.initForms();
      });


  }

  async fnBuscarValida(cedula) {
    return new Promise((resolve, reject) => {
      const dataTotal = [];
      this.firebaseS.GetBy('cda', cedula)
        .subscribe(res => {
          this.respuestaUsuarios = res;
          this.respuestaUsuarios.forEach(objeto => {
            dataTotal.push(objeto.payload.doc.data());
          });
          resolve(dataTotal);
        });
    });
  }

  async fnBuscarValidaEmail(cedula) {
    return new Promise((resolve, reject) => {
      const dataTotal = [];
      this.firebaseS.GetBy('crr', cedula)
        .subscribe(res => {
          this.respuestaUsuarios = res;
          this.respuestaUsuarios.forEach(objeto => {
            dataTotal.push(objeto.payload.doc.data());
          });
          resolve(dataTotal);
        });
    });
  }

  saveData() {
    alert(JSON.stringify(this.myForm.value));
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


}
