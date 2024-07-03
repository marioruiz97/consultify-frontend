import { Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from '../../service/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  cargando = false;

  constructor(private uiService: UIService) { }

  ngOnInit(): void {
    this.subs.push(
      this.uiService.loading$.subscribe(isLoading => {
        this.cargando = isLoading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
