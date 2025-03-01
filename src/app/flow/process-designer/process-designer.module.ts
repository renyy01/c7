import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessDesignerRoutingModule } from './process-designer-routing.module';
import { ProcessDesignerComponent } from './process-designer.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {Ng2DragDropModule} from 'ng2-drag-drop';

@NgModule({
  declarations: [ProcessDesignerComponent],
  imports: [
    CommonModule,
    ProcessDesignerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    Ng2DragDropModule.forRoot()
  ]
})
export class ProcessDesignerModule { }
