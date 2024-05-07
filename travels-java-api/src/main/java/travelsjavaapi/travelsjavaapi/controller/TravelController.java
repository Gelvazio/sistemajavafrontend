package travelsjavaapi.travelsjavaapi.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

// import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

// import io.github.mariazevedo88.travelsjavaapi.dto.model.travel.TravelDTO;
// import io.github.mariazevedo88.travelsjavaapi.dto.response.Response;
// import io.github.mariazevedo88.travelsjavaapi.exception.NotParsableContentException;
// import io.github.mariazevedo88.travelsjavaapi.exception.TravelInvalidUpdateException;
// import io.github.mariazevedo88.travelsjavaapi.exception.TravelNotFoundException;
// import io.github.mariazevedo88.travelsjavaapi.model.travel.Travel;
// import io.github.mariazevedo88.travelsjavaapi.service.travel.TravelService;
// import io.github.mariazevedo88.travelsjavaapi.util.TravelsApiUtil;
// import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/api-travels/travels")
public class TravelController {

    private static final Logger logger = Logger.getLogger(TravelController.class);

    @Autowired
    private TravelService travelService;

    @GetMapping
    public ResponseEntity<List<Travel>> find() {
        if (travelService.find().isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        logger.info(travelService.find());
        return ResponseEntity.ok(travelService.find());
    }

    @DeleteMapping
    public ResponseEntity<Boolean> delete() {
        try {
            travelService.delete();
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping
    @ResponseBody
    public ResponseEntity<Travel> create(@RequestBody JSONObject travel) {
        try {
            if (travelService.isJSONValid(travel.toString())) {
                Travel travelCreated = travelService.create(travel);
                var uri = ServletUriComponentsBuilder.fromCurrentRequest().path(travelCreated.getOrderNumber()).build()
                        .toUri();

                if (travelService.isStartDateGreaterThanEndDate(travelCreated)) {
                    logger.error("The start date is greater than end date.");
                    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
                } else {
                    travelService.add(travelCreated);
                    return ResponseEntity.created(uri).body(null);
                }
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            logger.error("JSON fields are not parsable. " + e);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
        }
    }

    @PutMapping(path = "/{id}", produces = { "application/json" })
    public ResponseEntity<Travel> update(@PathVariable("id") long id, @RequestBody JSONObject travel) {
        try {
            if (travelService.isJSONValid(travel.toString())) {
                Travel travelToUpdate = travelService.findById(id);
                if (travelToUpdate == null) {
                    logger.error("Travel not found.");
                    return ResponseEntity.notFound().build();
                } else {
                    Travel travelToUpdate = travelService.update(travelToUpdate, travel);
                    return ResponseEntity.ok(travelToUpdate);
                }
            } else {
                return ResponseEntity.badRequest().body(null);
            }
        } catch (Exception e) {
            logger.error("JSON fields are not parsable." + e);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(null);
        }
    }
}
