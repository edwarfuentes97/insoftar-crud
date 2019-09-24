import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar, MatDialog } from '@angular/material';
import { GlobalService } from '../../services/models/global.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})

export class UsuariosListComponent implements OnInit {


  ELEMENT_DATA: Usuario[];
  selectedRow: Usuario;
  respuestaUsuarios: any;
  dataTotal: any[];

  // tslint:disable-next-line: variable-name
  constructor(public firebaseS: FirebaseService, public dialog: MatDialog,
    // tslint:disable-next-line: variable-name
              private _snackBar: MatSnackBar, private globalService: GlobalService,
              private router: Router, ) {
  }


  ngOnInit() {
    this.fnBuscar();
  }
  // tslint:disable: member-ordering
  displayedColumns: string[] = ['select', 'uid', 'nme', 'apl', 'cda', 'crr', 'tel', 'nfc', 'act'];
  dataSource = new MatTableDataSource<Usuario>(this.ELEMENT_DATA);
  selection = new SelectionModel<Usuario>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    if (this.dataSource.data) {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => {
        this.selection.select(row);
      });
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Usuario): string {
    // console.log('ingreso', row);

    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.uid + 1}`;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  fnPropiedades() {
    if (this.selection.selected.length > 1) {
      this.openSnackBar('Debes seleccionar un unico registro', 'ERROR');
      return;
    }
    if (this.selection.selected.length < 1) {
      this.openSnackBar('Debes seleccionar almenos un registro', 'ERROR');
      return;
    }
    this.selectedRow = this.selection.selected[0];
    console.log(this.selectedRow);
    sessionStorage.setItem('lcUsuario', JSON.stringify(this.selectedRow));
    this.router.navigate(['/usuarios', this.selectedRow.cda]);
  }

  async fnDelete() {
    if (this.selection.selected.length > 1) {
      this.openSnackBar('Debes seleccionar un unico registro', 'ERROR');
      return;
    }
    if (this.selection.selected.length < 1) {
      this.openSnackBar('Debes seleccionar almenos un registro', 'ERROR');
      return;
    }
    console.log(this.selection.selected[0]);


    const cedula = await this.fnBuscarValida(this.selection.selected[0].cda);

    this.firebaseS.delete(cedula).then(res => {
      this.openSnackBar('El registro se elimino de manera exitosa', 'EXITO');
      this.dataTotal = [];
      this.fnBuscar();
    });

    // this.globalService.delete(this.selection.selected[0].uid).subscribe(resp => {
    //   console.log('respuesta al eliminar', resp);
    //   // tslint:disable-next-line: no-string-literal
    //   if (resp['code'] === 200) {
    //     this.openSnackBar('El registro se elimino de manera exitosa', 'EXITO');
    //     this.fnBuscar();
    //   } else {
    //     // tslint:disable: no-string-literal
    //     this.openSnackBar('Error ' + resp['data'], 'ERROR');
    //   }
    // });
  }

  fnNuevo() {
    this.router.navigate(['/usuarios', 'new']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // fnBuscar() {
  //   const filtros = { f: ['nombres'], v: [''], l: [''] };
  //   this.globalService.getAll(filtros).subscribe(resp => {
  //     console.log('repsuesta', resp);
  //     if (resp['code'] === 200) {
  //       this.dataSource.data = resp['data'];
  //       this.selection.clear();
  //     } else {
  //       this.openSnackBar('No se encontraron resultados', 'INFO');
  //       this.dataSource.data = null;
  //     }
  //   });
  // }



  async fnBuscarValida(cedula) {
    return new Promise((resolve, reject) => {
      this.firebaseS.GetBy('cda', cedula)
        .subscribe(res => {
          resolve(res);
        });
    });
  }



  fnBuscar() {
    this.dataTotal = [];
    this.firebaseS.Get()
      .subscribe(res => {
        console.log('respuesta de busqueda en firebase');
        this.respuestaUsuarios = res;
        console.log('respuesta de busqueda en firebase', this.respuestaUsuarios);
        this.respuestaUsuarios.forEach(objeto => {
          console.log(objeto);
          this.dataTotal.push(objeto.payload.doc.data());
        });

        console.log('dataTotal', this.dataTotal);
        this.dataSource.data = this.dataTotal;


      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: 'Relamente desea eliminar  - ' + this.selection.selected[0].nme + ' ? '
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Yes clicked');
        this.fnDelete();
      }

    });
  }



}


