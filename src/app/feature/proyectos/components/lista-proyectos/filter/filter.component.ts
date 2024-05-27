import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Cliente } from 'src/app/feature/clientes/model/cliente.model';
import { ClienteService } from 'src/app/feature/clientes/service/cliente.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private clientes: Cliente[] = [];

  filteredClientes: Observable<Cliente[]> = of(this.clientes);
  form: FormGroup;
  maxDate = new Date();

  @Output() filtrar = new EventEmitter();
  @Output() eliminarFiltros = new EventEmitter();

  constructor(private clienteService: ClienteService) {
    this.form = this.initForm();
  }

  ngOnInit() {
    this.fetchClientes();
    const clienteControl = this.form.get('cliente');
    if (clienteControl !== null) {
      this.filteredClientes = clienteControl.valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filter(value) : this.clientes.slice())
      );
    }
  }

  fetchClientes() {
    this.subs.push(this.clienteService.obtenerClientes().subscribe(res => this.clientes = res));
  }

  private initForm(): FormGroup {
    return new FormGroup({
      nombreProyecto: new FormControl(''),
      cliente: new FormControl(''),
      desde: new FormControl('')
    });
  }

  private _filter(value: string): Cliente[] {
    const filterValue = value.trim().toLowerCase();
    return this.clientes.filter(c =>
      c.razonSocial.toLowerCase().includes(filterValue) || c.nombreComercial.toLowerCase().includes(filterValue)
    ).slice();
  }

  ejecutarFiltro() {
    this.filtrar.emit(this.form.value);
  }

  ngOnDestroy() {
    if (this.subs) { this.subs.forEach(s => s.unsubscribe()); }
  }

}
