import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of, tap} from "rxjs";
import {User} from "./model/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'api/user';

  httpsOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl)
      .pipe(
        tap(_ => console.log("Users fetched")),
        catchError(this.handleError<User[]>('getUsers', []))
      )
  }

  addUser(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(this.userUrl, user, this.httpsOptions).pipe(
      tap((newUser: User) => console.log(`Added user ${newUser.name}|${newUser.email}`)),
      catchError(this.handleError<User>('addUser'))
    )
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.userUrl}/${id}`, this.httpsOptions).pipe(
      tap(_ => console.log(`Deleted user id=${id}`)),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  updateUser(user: User): Observable<any> {
    return this.http.put(`${this.userUrl}/${user.id}`, user, this.httpsOptions).pipe(
      tap(_ => console.log(`Updated user id=${user.id}`)),
      catchError(this.handleError<any>('updateUser'))
    )
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
