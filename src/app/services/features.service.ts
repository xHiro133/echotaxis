import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable, of, switchMap } from "rxjs";
import { Role } from "../models/feature.model";

@Injectable({ providedIn: 'root' })
export class FeaturesService {

    activeRole: Role = Role.GUEST;

    constructor(private _configService: ConfigService) {}

    isFeatureActive(featureName: string, role?: Role): Observable<{ feature: string, active: boolean, reason?: string }> {
        return this._configService.getFeaturesConfig().pipe(
            switchMap((features) => {
                const feature = features?.find(f => f.name === featureName);

                if (!feature) {
                    return of(this._buildResponse(featureName, false, 'Feature not found'));
                }

                if (!feature.enabled) {
                    return of(this._buildResponse(featureName, false, 'Feature is disabled'));
                }

                if (feature.grantNone || !feature.grant.includes(role || this.activeRole)) {
                    return of(this._buildResponse(featureName, false, `Role not granted (Needs: ${feature.grant.join(', ')} - Selected: ${role || this.activeRole})`));
                }

                if (feature.grantAll || feature.grant.includes(role || this.activeRole)) {
                    return of(this._buildResponse(featureName, true));
                }

                return of(this._buildResponse(featureName, false, 'Access denied for unknown reason'));
            })
        );
    }

    private _buildResponse(featureName: string, active: boolean, reason?: string) {
        return { feature: featureName, active, reason };
    }

}