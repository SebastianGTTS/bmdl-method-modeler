import { Injectable } from '@angular/core';
import { PouchdbService } from '../database/pouchdb.service';
import PouchDB from 'pouchdb-browser';
import { BmProcess } from './bm-process';
import { DevelopmentProcessRegistryModule } from './development-process-registry.module';

@Injectable({
  providedIn: DevelopmentProcessRegistryModule
})
export class BmProcessService {

  constructor(
    private pouchdbService: PouchdbService,
  ) {
  }

  /**
   * Get the list of the bm processes.
   */
  getBmProcessList() {
    return this.pouchdbService.find<BmProcess>(BmProcess.typeName, {
      selector: {},
    });
  }

  /**
   * Add new bm process.
   *
   * @param name name of the bm process
   */
  addBmProcess(name: string) {
    return this.pouchdbService.post(new BmProcess({name}));
  }

  /**
   * Update the bm process.
   *
   * @param id id of the bm process
   * @param bmProcess the new values of the object (values will be copied)
   */
  updateBmProcess(id: string, bmProcess: Partial<BmProcess>) {
    return this.getBmProcess(id).then((process) => {
      process.update(bmProcess);
      return this.saveBmProcess(process);
    });
  }

  /**
   * Get the bm process.
   *
   * @param id id of the bm process
   */
  getBmProcess(id: string): Promise<BmProcess> {
    return this.pouchdbService.get<BmProcess>(id).then((e) => new BmProcess(e));
  }

  /**
   * Remove the bm process.
   *
   * @param id id of the bm process
   */
  deleteBmProcess(id: string) {
    return this.pouchdbService.get(id).then(result => {
      return this.pouchdbService.remove(result);
    });
  }

  private saveBmProcess(bmProcess: BmProcess): Promise<PouchDB.Core.Response> {
    return this.pouchdbService.put(bmProcess);
  }
}
