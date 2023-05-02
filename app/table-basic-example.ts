import { Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDragDrop,  moveItemInArray,  transferArrayItem,  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { MatTable } from '@angular/material/table';
import { Log } from '@angular/core/testing/src/logger';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
export interface Instruction {
  pariority: number;
  partAcc: string;
  contraAcc: string;
}

export interface FlatMapNode {
  name: string;
  parent: string;
  childern: FlatMapNode[];
  level: number;
  pariority: number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
const Instruction_List: Instruction[] = [
  { pariority: 1, contraAcc: 'B', partAcc: 'D' },
  { pariority: 2, contraAcc: 'B', partAcc: 'E' },
  { pariority: 3, contraAcc: 'C', partAcc: 'F' },
  { pariority: 4, contraAcc: 'C', partAcc: 'G' },
  { pariority: 5, contraAcc: 'C', partAcc: 'H' },
  { pariority: 6, contraAcc: 'A', partAcc: 'B' },
  { pariority: 7, contraAcc: 'A', partAcc: 'C' },
];

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'table-basic-example',
  styleUrls: ['table-basic-example.css'],
  templateUrl: 'table-basic-example.html',
})
export class TableBasicExample implements OnInit {
  @ViewChild('table') table: MatTable<Instruction>;
  displayedColumns: string[] = ['pariority', 'partAcc', 'contraAcc'];
  dataSource = Instruction_List;
  levelMaxPriorityArray: number[] = [7, 5];
  flatMap: { [key: string]: FlatMapNode } = {
    A: { name: 'A', parent: '', childern: [], level: -1, pariority: -1 },
    B: { name: 'B', parent: '', childern: [], level: -1, pariority: -1 },
    C: { name: 'C', parent: '', childern: [], level: -1, pariority: -1 },
    D: { name: 'D', parent: '', childern: [], level: -1, pariority: -1 },
    E: { name: 'E', parent: '', childern: [], level: -1, pariority: -1 },
    F: { name: 'F', parent: '', childern: [], level: -1, pariority: -1 },
    G: { name: 'G', parent: '', childern: [], level: -1, pariority: -1 },
    H: { name: 'H', parent: '', childern: [], level: -1, pariority: -1 },
  };
  //    drop(event: CdkDragDrop<string[]>) {
  //     moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  //   }

  //   onListDrop(event: CdkDragDrop<string[]>) {
  //   // Swap the elements around
  //   moveItemInArray(this.dataSource, event.previousIndex, event.currentIndex);
  // }
  ngOnInit(): void {
    this.flatMap['A'].level = 0;

    this.flatMap['B'].level = 1;
    this.flatMap['B'].parent = 'A';
    this.flatMap['B'].pariority = 6;
    this.flatMap['A'].childern.push(this.flatMap['B']);

    this.flatMap['C'].level = 1;
    this.flatMap['C'].pariority = 7;
    this.flatMap['C'].parent = 'A';
    this.flatMap['A'].childern.push(this.flatMap['C']);

    this.flatMap['D'].level = 2;
    this.flatMap['D'].pariority = 1;
    this.flatMap['D'].parent = 'B';
    this.flatMap['B'].childern.push(this.flatMap['D']);

    this.flatMap['E'].level = 2;
    this.flatMap['E'].pariority = 2;
    this.flatMap['E'].parent = 'B';
    this.flatMap['B'].childern.push(this.flatMap['E']);

    this.flatMap['F'].level = 2;
    this.flatMap['F'].pariority = 3;
    this.flatMap['F'].parent = 'C';
    this.flatMap['C'].childern.push(this.flatMap['F']);

    this.flatMap['G'].level = 2;
    this.flatMap['G'].pariority = 4;
    this.flatMap['G'].parent = 'C';
    this.flatMap['C'].childern.push(this.flatMap['G']);

    this.flatMap['H'].level = 2;
    this.flatMap['H'].pariority = 5;
    this.flatMap['H'].parent = 'C';
    this.flatMap['C'].childern.push(this.flatMap['H']);

    // console.log(this.flatMap['A']);
  }
  dropTable(event: CdkDragDrop<Instruction[]>) {
    let min = 0;
    let contra = event.item.data.contraAcc;
    let partAcc = event.item.data.partAcc;
    let level = this.flatMap[partAcc].level;
    if (this.levelMaxPriorityArray.length > level) {
      min = this.levelMaxPriorityArray[level] + 1;
    }
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    // console.log(event);
    if (
      event.currentIndex < this.levelMaxPriorityArray[level - 1] &&
      event.currentIndex >= min
    ) {
      moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
      this.dataSource.forEach((item: any, index) => {
        // console.log(item);
        item.pariority = index + 1;
        // console.log(this.flatMap[partAcc]);
        this.flatMap[item.partAcc].pariority = item.pariority;
      });
    }
    this.table.renderRows();
    // console.log(this.flatMap['A']);
    // console.log(this.dataSource);
  }
}

/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
