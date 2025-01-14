import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Urls} from '../../../../public/url';
import {Observable, Observer} from 'rxjs';
import {Router} from '@angular/router';
import {HttpsUtils} from '../../../utils/HttpsUtils.service';
import {NzNotificationService} from 'ng-zorro-antd';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.css']
})
export class MenuAddComponent implements OnInit {

  /**
   * 属性描述: 面包屑菜单路径
   * 参数：
   **/
  crumbs: any = {
    title: '菜单管理',
    subTitle: '新建菜单'
  };

  validateForm: FormGroup;

  validTimeOutEvent: any;

  menuLevels: [
    {name: '一级菜单', value: 0},
    {name: '二级菜单', value: 1}
    ];

  formData = {};

  topMenus = [];

  /**
   * 方法用途: 提交表单
   * 参数: 事件， 表单值
   **/
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    }
    this.https.post(Urls.MENUS.SAVE, value).then(resp => {
      console.log(resp);
      if (resp['code'] === 200) {
        this.router.navigate([Urls.BUSINESS.MENUS.LIST]);
        this.notification.success('成功', resp['msg']);
      } else {
        this.notification.error('失败', resp['msg']);
      }
    });
  };

  /**
   * 方法用途: 重置表单
   * 参数:  事件
   **/
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  /**
   * 方法用途: 菜单名称异步验证
   * 参数:
   **/
  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    const _this = this;
    if (this.validTimeOutEvent) {
      clearTimeout(this.validTimeOutEvent);
    }
    this.validTimeOutEvent = setTimeout(function () {
      _this.https.get(Urls.MENUS.VALIDMENUNAME + control.value).then(resp => {
        if (resp['code'] === 200 && resp['data'] === true) {
          observer.next(null);
        } else {
          observer.next({error: true, duplicated: true});
        }
        observer.complete();
      }, resp => {
        observer.next({error: true, duplicated: true});
        observer.complete();
      });
    }, 1000);
  });

  /**
   * 方法用途: 构造器构造验证对象
   * 参数:
   **/
  constructor(private fb: FormBuilder, public router: Router, public https: HttpsUtils, private notification: NzNotificationService) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required], [this.userNameAsyncValidator]],
      url: ['', [Validators.required]],
      type: ['', Validators.required],
      parentId: ['', [], [this.subMenuValidator]]
    });
    this.https.get(Urls.OPTIONS.MENUS.LEVEL).then(data => {
      this.menuLevels = data['data'];
    });
    const _this = this;
    this.https.get(Urls.MENUS.TOPMENUS).then(data => {
      $.each(data['data'], function (index, item) {
        _this.topMenus.push({name: item['name'], value: item['menuId']});
      });
    });
  }

  subMenuValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    if (this.formData['type'] && this.formData['type'] === '2'
      && !control.value) {
      observer.next({error: true, duplicated: true});
    } else {
      observer.next(null);
    }
    observer.complete();
  });

  nzListOfSelectedValueChange() {
      this.validateForm.controls['parentId'].markAsPristine();
      this.validateForm.controls['parentId'].updateValueAndValidity();
  }

  ngOnInit() {
  }
}
